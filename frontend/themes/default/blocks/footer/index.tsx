import cn from "classnames";
import Image from "next/image";

export async function footer(props: any) {
  // Function to generate Google Maps URL
  const getGoogleMapsUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };

  return (
    <footer className="footer container mx-auto mb-[50px]">
      <div className="footer__container flex w-full flex-col gap-[20px] rounded-lg bg-tertiary p-[40px] text-white md:flex-row md:p-[60px]">
        <div className="flex w-full flex-col gap-[20px]">
          {props.data.logo && (
            <div className="footer__logo relative h-[80px] w-[80px]">
              <Image
                src={props.data.logo.url}
                alt={props.data.logo.alt}
                fill
                className="mix-blend-multiply"
              />
            </div>
          )}
          <div className="footer__text">
            <div dangerouslySetInnerHTML={{ __html: props.data.text }} />
          </div>
          <div className="footer__contacts flex flex-col gap-[20px] md:flex-row md:gap-[80px]">
            <div className="footer__phone">
              <h6 className="icon-phone uppercase">{props.data.phone.text}</h6>
              <a
                href={props.data.phone.cta.url}
                target={props.data.phone.cta.target}
              >
                {props.data.phone.cta.title}
              </a>
            </div>
          </div>
          <div className="footer__bottom_nav">{/* <HeaderNav /> */}</div>
          <div className="footer__copyright hidden text-[12px] md:flex">
            <div>{props.data.copyright}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
