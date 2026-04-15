"use client";

import classNames from "classnames";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../atoms/Button";
import { Close } from "@ui/icons/icon-loader";
import { parseVideoAtts } from "@ui/utils/video";

type ModalProps = {
	children: ReactNode;
	showModal: boolean;
	setShowModal: (value: boolean) => void;
	maxWidth?: string;
	maxHeight?: string;
	className?: string;
	position?: "center" | "bottom";
};

type MediaItem = {
	type: "image" | "video";
	src: string;
	alt: string;
	element: HTMLElement;
	poster?: string;
};

type LightboxState = {
	isOpen: boolean;
	currentMedia: MediaItem | null;
	currentIndex: number;
	mediaItems: MediaItem[];
};

const getModalRoot = () => {
	let modalRoot = document.getElementById("modal-root");
	if (!modalRoot) {
		modalRoot = document.createElement("div");
		modalRoot.id = "modal-root";
		document.body.appendChild(modalRoot);
	}
	return modalRoot;
};

const Modal: React.FC<ModalProps> = ({
	children,
	showModal,
	setShowModal,
	maxWidth,
	maxHeight,
	className,
	position = "center",
}) => {

	const modalRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const [previousUrl, setPreviousUrl] = useState("");
	const [lightbox, setLightbox] = useState<LightboxState>({
		isOpen: false,
		currentMedia: null,
		currentIndex: 0,
		mediaItems: [],
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (showModal) {
			// Render portal first
			setShouldRender(true);
			// Then trigger animations after DOM is ready
			const animationTimer = setTimeout(() => {
				setIsAnimating(true);
				document.body.style.overflow = "hidden";
				setPreviousUrl(window.location.href.split("#")[0]);
			}, 10);

			return () => clearTimeout(animationTimer);
		} else {
			// Start closing animation
			setIsAnimating(false);
			document.body.style.overflow = "";
			if (previousUrl && window.location.hash) {
				window.history.pushState({}, "", previousUrl);
			}
			// Cleanup portal after animation completes
			const cleanupTimer = setTimeout(() => {
				setShouldRender(false);
			}, 1200); // Match the longest animation duration

			return () => clearTimeout(cleanupTimer);
		}
	}, [showModal, previousUrl]);

	useEffect(() => {
		if (!isAnimating || !mounted || !modalRef.current) return;

		const setupLightbox = () => {
			if (modalRef.current) {
				const galleryItems =
					modalRef.current.querySelectorAll(".gallery-item");
				const mediaItems: MediaItem[] = [];

				galleryItems.forEach((item: any) => {
					const img = item.querySelector("img");
					const video = item.querySelector("video");

					if (img) {
						mediaItems.push({
							type: "image",
							src: img.src || img.dataset.src || "",
							alt: img.alt || "",
							element: item as HTMLElement,
						});
					} else if (video) {
						let videoSrc = video.src;
						if (!videoSrc) {
							const source = video.querySelector("source");
							videoSrc = source ? source.src : "";
						}

						mediaItems.push({
							type: "video",
							src: videoSrc,
							alt:
								video.title ||
								video.getAttribute("aria-label") ||
								"Video",
							element: item as HTMLElement,
							poster: video.poster || "",
						});
					}
				});

				const handleGalleryClick = (event: Event) => {
					event.preventDefault();
					const clickedElement = event.currentTarget as HTMLElement;
					const clickedIndex = mediaItems.findIndex(
						(media) => media.element === clickedElement
					);

					if (clickedIndex >= 0) {
						const currentMedia = mediaItems[clickedIndex];

						setLightbox({
							isOpen: true,
							currentMedia,
							currentIndex: clickedIndex,
							mediaItems,
						});
					}
				};

				galleryItems.forEach((item: any) => {
					item.addEventListener("click", handleGalleryClick);
					(item as HTMLElement).style.cursor = "pointer";
				});

				return () => {
					galleryItems.forEach((item: any) => {
						item.removeEventListener("click", handleGalleryClick);
						(item as HTMLElement).style.cursor = "";
					});
				};
			}
		};

		const timeoutId = setTimeout(setupLightbox, 100);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [isAnimating, mounted, children]);

	const navigateLightbox = useCallback(
		(direction: "prev" | "next") => {
			if (lightbox.mediaItems.length === 0) return;

			let newIndex;
			if (direction === "prev") {
				newIndex =
					lightbox.currentIndex > 0
						? lightbox.currentIndex - 1
						: lightbox.mediaItems.length - 1;
			} else {
				newIndex =
					lightbox.currentIndex < lightbox.mediaItems.length - 1
						? lightbox.currentIndex + 1
						: 0;
			}

			const newMedia = lightbox.mediaItems[newIndex];
			setLightbox((prev) => ({
				...prev,
				currentIndex: newIndex,
				currentMedia: newMedia,
			}));
		},
		[lightbox.mediaItems, lightbox.currentIndex]
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (lightbox.isOpen) {
				switch (event.key) {
					case "Escape":
						setLightbox((prev) => ({ ...prev, isOpen: false }));
						break;
					case "ArrowLeft":
						navigateLightbox("prev");
						break;
					case "ArrowRight":
						navigateLightbox("next");
						break;
				}
			} else if (event.key === "Escape" && isAnimating) {
				setShowModal(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		setShowModal,
		lightbox.isOpen,
		lightbox.currentIndex,
		lightbox.mediaItems.length,
		isAnimating,
		navigateLightbox,
	]);

	const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			setShowModal(false);
		}
	};

	const handleLightboxOutsideClick = (
		e: React.MouseEvent<HTMLDivElement>
	) => {
		if (e.target === e.currentTarget) {
			setLightbox((prev) => ({ ...prev, isOpen: false }));
		}
	};

	const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

	const style: React.CSSProperties = {
		...(maxWidth && { maxWidth }),
		...(maxHeight && { maxHeight }),
	};

	const renderLightboxMedia = () => {
		if (!lightbox.currentMedia) return null;

		if (lightbox.currentMedia.type === "video") {
			const videoAtts = parseVideoAtts(lightbox.currentMedia.src);
			return (
				<video
					src={videoAtts ? videoAtts.src : lightbox.currentMedia.src}
					controls
					className="max-h-full max-w-full"
					onClick={(e) => e.stopPropagation()}
					style={{ maxHeight: "90vh", maxWidth: "90vw" }}
				>
					<source
						src={
							videoAtts
								? videoAtts.src
								: lightbox.currentMedia.src
						}
						type={videoAtts ? videoAtts.src : "video/mp4"}
					/>
					Your browser does not support the video tag.
				</video>
			);
		} else {
			return (
				<img
					src={lightbox.currentMedia.src}
					alt={lightbox.currentMedia.alt}
					className="max-h-full max-w-full object-contain"
					onClick={(e) => e.stopPropagation()}
				/>
			);
		}
	};

	const modalContent = (
		<div
			className={classNames(
				"modal fixed left-0 top-0 h-dvh w-screen bg-black/40 transition-all overflow-auto duration-[800ms] z-[9999] opacity-0",
				isAnimating
					? "!opacity-100 pointer-events-auto visible"
					: "opacity-0 pointer-events-none not-visible",
				className
			)}
			onClick={handleOutsideClick}
			ref={modalRef}
		>
		<div
			className={classNames(
				"modal-inner absolute md:min-h-[unset] w-full transition-all bg-white p-6 rounded-sm duration-[1200ms] md:duration-700 md:delay-100 overflow-y-auto",
				position === "center" && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
				position === "bottom" && "md:right-[24px] md:bottom-[24px] bottom-0 max-h-[90%]",
				isAnimating
					? "md:opacity-100"
					: "md:opacity-0 translate-y-[-45%]"
			)}
			style={style}
			onClick={handleModalContentClick}
		>
				<Button
					className="!absolute right-[15px] top-[15px] !z-[99999] close-button is-inverted"
					style="primary"
					type="button"
					onClick={() => setShowModal(false)}
				>
					<Close />
        </Button>
				{children}
			</div>

			{lightbox.isOpen && (
				<div
					className={classNames(
						"fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 opacity-0",
						lightbox.isOpen && "!opacity-100"
					)}
					onClick={handleLightboxOutsideClick}
				>
					<Button
						className="!absolute right-4 top-4 z-50 bg-black/50 !text-white hover:bg-black/70 close-button"
						style="primary"
						size="md"
						type="button"
						onClick={() =>
							setLightbox((prev) => ({ ...prev, isOpen: false }))
						}
					>
            <Close />
          </Button>
					
					{lightbox.mediaItems.length > 1 && (
						<>
							<button
								className="absolute left-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70"
								onClick={() => navigateLightbox("prev")}
								aria-label="Previous media"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<polyline points="15,18 9,12 15,6"></polyline>
								</svg>
							</button>
							<button
								className="absolute right-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70"
								onClick={() => navigateLightbox("next")}
								aria-label="Next media"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<polyline points="9,18 15,12 9,6"></polyline>
								</svg>
							</button>
						</>
					)}

					{lightbox.mediaItems.length > 1 && (
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-2 text-sm text-white">
							{lightbox.currentIndex + 1} /{" "}
							{lightbox.mediaItems.length}
						</div>
					)}

					<div className="flex max-h-full max-w-full items-center justify-center">
						{renderLightboxMedia()}
					</div>
				</div>
			)}
		</div>
	);

	return mounted && shouldRender
		? createPortal(modalContent, getModalRoot())
		: null;
};

export default Modal;
