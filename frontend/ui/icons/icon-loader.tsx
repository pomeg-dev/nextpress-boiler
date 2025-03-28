import classNames from 'classnames';
import React from 'react';

type IconProps = {
  fill?: string;
  stroke?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  active?: boolean;
};

export const ChevronLeft: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.2071 5.29289C14.5976 5.68342 14.5976 6.31658 14.2071 6.70711L8.91421 12L14.2071 17.2929C14.5976 17.6834 14.5976 18.3166 14.2071 18.7071C13.8166 19.0976 13.1834 19.0976 12.7929 18.7071L6.79289 12.7071C6.40237 12.3166 6.40237 11.6834 6.79289 11.2929L12.7929 5.29289C13.1834 4.90237 13.8166 4.90237 14.2071 5.29289Z" fill={fill} />
  </svg>
);

export const ChevronRight: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.79289 18.7071C9.40237 18.3166 9.40237 17.6834 9.79289 17.2929L15.0858 12L9.79289 6.70711C9.40237 6.31658 9.40237 5.68342 9.79289 5.29289C10.1834 4.90237 10.8166 4.90237 11.2071 5.29289L17.2071 11.2929C17.5976 11.6834 17.5976 12.3166 17.2071 12.7071L11.2071 18.7071C10.8166 19.0976 10.1834 19.0976 9.79289 18.7071Z" fill={fill} />
  </svg>
);

export const ChevronDown: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.79289C5.68342 8.40237 6.31658 8.40237 6.70711 8.79289L12 14.0858L17.2929 8.79289C17.6834 8.40237 18.3166 8.40237 18.7071 8.79289C19.0976 9.18342 19.0976 9.81658 18.7071 10.2071L12.7071 16.2071C12.3166 16.5976 11.6834 16.5976 11.2929 16.2071L5.29289 10.2071C4.90237 9.81658 4.90237 9.18342 5.29289 8.79289Z" fill={fill} />
  </svg>
);

export const Check: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className,
  active = false
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M21.6746 4.60321C22.1085 5.03712 22.1085 5.74064 21.6746 6.17456L9.45234 18.3968C9.01843 18.8307 8.31491 18.8307 7.88099 18.3968L2.32544 12.8412C1.89152 12.4073 1.89152 11.7038 2.32544 11.2699C2.75935 10.836 3.46287 10.836 3.89679 11.2699L8.66667 16.0398L20.1032 4.60321C20.5371 4.16929 21.2406 4.16929 21.6746 4.60321Z" fill={active ? "url(#active)" : fill} />
    {active &&
      <defs>
        <linearGradient id="active" x1="1.33398" y1="7.66687" x2="14.6673" y2="7.66687" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F47F2F"/>
          <stop offset="1" stop-color="#FAD15D"/>
        </linearGradient>
      </defs>
    }
  </svg>
);

export const Close: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289Z" fill={fill} />
    <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill={fill} />
  </svg>
);

export const Plus: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z" fill={fill} />
  </svg>
);

export const Minus: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z" fill={fill} />
  </svg>
);

export const ArrowLeft: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" className={classNames("transition-transform group-hover:-translate-x-1", className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z" fill={fill} />
    <path fillRule="evenodd" clipRule="evenodd" d="M12.7071 4.29289C13.0976 4.68342 13.0976 5.31658 12.7071 5.70711L6.41421 12L12.7071 18.2929C13.0976 18.6834 13.0976 19.3166 12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071L4.29289 12.7071C3.90237 12.3166 3.90237 11.6834 4.29289 11.2929L11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289Z" fill={fill} />
  </svg>
);

export const ArrowRight: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" className={classNames("transition-transform group-hover:translate-x-1", className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z" fill={fill} />
    <path fillRule="evenodd" clipRule="evenodd" d="M11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289L19.7071 11.2929C20.0976 11.6834 20.0976 12.3166 19.7071 12.7071L12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071C10.9024 19.3166 10.9024 18.6834 11.2929 18.2929L17.5858 12L11.2929 5.70711C10.9024 5.31658 10.9024 4.68342 11.2929 4.29289Z" fill={fill} />
  </svg>
);

export const WaterDrop: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className,
  active = false
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12.7021 1.29289C12.5145 1.10525 12.2599 0.999883 11.9946 1C11.7292 1.00012 11.4748 1.10571 11.2873 1.29352L5.63813 6.95266C4.37919 8.21101 3.52106 9.81501 3.17337 11.5607C2.82562 13.3067 3.00351 15.1166 3.68452 16.7615C4.36554 18.4064 5.51909 19.8123 6.99926 20.8015C8.47943 21.7907 10.2197 22.3187 12 22.3187C13.7803 22.3187 15.5206 21.7907 17.0007 20.8015C18.4809 19.8123 19.6345 18.4064 20.3155 16.7615C20.9965 15.1166 21.1744 13.3067 20.8266 11.5607C20.4789 9.81484 19.6212 8.2113 18.3621 6.95289L12.7021 1.29289ZM11.9956 3.41484L16.9479 8.36711C17.9273 9.34589 18.5947 10.5934 18.8652 11.9514C19.1356 13.3094 18.9973 14.7171 18.4676 15.9964C17.9379 17.2758 17.0407 18.3693 15.8895 19.1387C14.7382 19.908 13.3847 20.3187 12 20.3187C10.6153 20.3187 9.26178 19.908 8.11054 19.1387C6.95929 18.3693 6.06209 17.2758 5.53241 15.9964C5.00273 14.7171 4.86437 13.3094 5.13484 11.9514C5.40531 10.5934 6.07245 9.34612 7.05188 8.36734L11.9956 3.41484Z" fill={active ? "url(#active)" : fill} />
    {active &&
      <defs>
        <linearGradient id="active" x1="0" y1="10.6594" x2="18" y2="10.6594" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F47F2F"/>
          <stop offset="1" stop-color="#FAD15D"/>
        </linearGradient>
      </defs>
    }
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "24", 
  height = "24",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 13 14" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M6.4 7.0001C8.168 7.0001 9.6 5.5681 9.6 3.8001C9.6 2.0321 8.168 0.600098 6.4 0.600098C4.632 0.600098 3.2 2.0321 3.2 3.8001C3.2 5.5681 4.632 7.0001 6.4 7.0001ZM6.4 8.6001C4.264 8.6001 0 9.6721 0 11.8001V13.4001H12.8V11.8001C12.8 9.6721 8.536 8.6001 6.4 8.6001Z" fill={fill} />
  </svg>
);

export const Hamburger: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  stroke = "currentColor", 
  width = "24", 
  height = "24",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 17" fill="none" className={classNames(className)}>
    <line
      x1="1.8125"
      y1="1.98956"
      x2="16.8125"
      y2="1.98956"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="1.8125"
      y1="8.98956"
      x2="16.8125"
      y2="8.98956"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="1.8125"
      y1="15.9896"
      x2="16.8125"
      y2="15.9896"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const Bullet: React.FC<IconProps> = ({ 
  fill = "currentColor", 
  width = "15", 
  height = "15",
  className
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 15 15" fill="none" className={classNames(className)}>
    <circle cx="7.33333" cy="7.49996" r="7.33333" fill={fill} />
  </svg>
);

export const Heart: React.FC<IconProps> = ({
  fill = "currentColor", 
  width = "21", 
  height = "21",
  className,
  active = false,
}) => (
  <svg width={width} height={height} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className={classNames(className)}>
    {active ? (
      <>
        <path fillRule="evenodd" clipRule="evenodd" d="M11.9488 2.27248C12.5821 2.01007 13.261 1.875 13.9465 1.875C14.632 1.875 15.3108 2.01007 15.9441 2.27248C16.5773 2.53484 17.1526 2.91937 17.6372 3.4041C18.1221 3.88872 18.5067 4.46413 18.7691 5.09745C19.0315 5.73076 19.1666 6.40957 19.1666 7.0951C19.1666 7.78063 19.0315 8.45944 18.7691 9.09275C18.5067 9.72607 18.1221 10.3015 17.6372 10.7861L10.589 17.8344C10.4327 17.9906 10.2207 18.0784 9.9997 18.0784C9.77869 18.0784 9.56673 17.9906 9.41045 17.8344L2.36206 10.786C1.38318 9.80709 0.833252 8.47944 0.833252 7.0951C0.833252 5.71076 1.38318 4.38311 2.36206 3.40423C3.34094 2.42535 4.66858 1.87543 6.05293 1.87543C7.43727 1.87543 8.76491 2.42535 9.74379 3.40423L9.9997 3.66015L10.2555 3.40437C10.7401 2.91958 11.3156 2.53487 11.9488 2.27248Z" fill="url(#active)" />
        <defs>
          <linearGradient id="active" x1="0.833252" y1="9.97672" x2="19.1666" y2="9.97672" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F47F2F"/>
            <stop offset="1" stopColor="#FAD15D"/>
          </linearGradient>
        </defs>
      </>
    ) : (
      <path fillRule="evenodd" clipRule="evenodd" d="M12.2835 3.20314C12.9169 2.94073 13.5957 2.80566 14.2812 2.80566C14.9667 2.80566 15.6455 2.94073 16.2789 3.20314C16.912 3.46551 17.4874 3.85003 17.9719 4.33476C18.4568 4.81939 18.8414 5.3948 19.1038 6.02811C19.3662 6.66142 19.5013 7.34023 19.5013 8.02576C19.5013 8.71129 19.3662 9.3901 19.1038 10.0234C18.8414 10.6567 18.4568 11.2321 17.9719 11.7168L10.9237 18.765C10.7674 18.9213 10.5554 19.0091 10.3344 19.0091C10.1134 19.0091 9.90145 18.9213 9.74517 18.765L2.69678 11.7166C1.7179 10.7378 1.16797 9.41011 1.16797 8.02576C1.16797 6.64142 1.7179 5.31378 2.69678 4.3349C3.67565 3.35602 5.0033 2.80609 6.38764 2.80609C7.77199 2.80609 9.09963 3.35602 10.0785 4.3349L10.3344 4.59081L10.5902 4.33504C10.5902 4.33499 10.5903 4.33494 10.5903 4.3349C11.0749 3.85011 11.6503 3.46553 12.2835 3.20314ZM14.2812 4.47233C13.8146 4.47233 13.3526 4.56426 12.9215 4.74287C12.4905 4.92148 12.0988 5.18326 11.769 5.51327L10.9237 6.35858C10.5982 6.68401 10.0706 6.68401 9.74517 6.35858L8.9 5.51341C8.23368 4.84709 7.32996 4.47276 6.38764 4.47276C5.44533 4.47276 4.5416 4.84709 3.87529 5.51341C3.20897 6.17973 2.83464 7.08345 2.83464 8.02576C2.83464 8.96808 3.20897 9.8718 3.87529 10.5381L10.3344 16.9973L16.7937 10.538C17.1237 10.2081 17.3855 9.81649 17.5641 9.38543C17.7427 8.95438 17.8346 8.49236 17.8346 8.02576C17.8346 7.55917 17.7427 7.09715 17.5641 6.6661C17.3855 6.23504 17.1237 5.8434 16.7937 5.51355L16.7934 5.51327C16.4636 5.18326 16.0719 4.92148 15.6409 4.74287C15.2098 4.56426 14.7478 4.47233 14.2812 4.47233Z" fill={fill} />
    )
    }
  </svg>
);

export const Error: React.FC<IconProps> = ({
  fill = "currentColor", 
  width = "16", 
  height = "16",
  className,
  active = false,
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" fill="none" className={classNames(className)}>
    <path d="M7.99998 1.33334C4.31998 1.33334 1.33331 4.32001 1.33331 8.00001C1.33331 11.68 4.31998 14.6667 7.99998 14.6667C11.68 14.6667 14.6666 11.68 14.6666 8.00001C14.6666 4.32001 11.68 1.33334 7.99998 1.33334ZM8.66665 11.3333H7.33331V10H8.66665V11.3333ZM8.66665 8.66668H7.33331V4.66668H8.66665V8.66668Z" fill={fill} />
  </svg>
);

export const Trash: React.FC<IconProps> = ({
  fill = "currentColor", 
  width = "20", 
  height = "20",
  className,
  active = false,
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M5.83335 4.72163V3.94385C5.83335 3.32501 6.09675 2.73152 6.56559 2.29394C7.03443 1.85635 7.67031 1.61052 8.33335 1.61052H11.6667C12.3297 1.61052 12.9656 1.85635 13.4345 2.29394C13.9033 2.73152 14.1667 3.32501 14.1667 3.94385V4.72163H17.5C17.9603 4.72163 18.3334 5.06985 18.3334 5.49941C18.3334 5.92896 17.9603 6.27719 17.5 6.27719H16.6667V16.3883C16.6667 17.0071 16.4033 17.6006 15.9345 18.0382C15.4656 18.4758 14.8297 18.7216 14.1667 18.7216H5.83335C5.17031 18.7216 4.53443 18.4758 4.06559 18.0382C3.59675 17.6006 3.33335 17.0071 3.33335 16.3883V6.27719H2.50002C2.03978 6.27719 1.66669 5.92896 1.66669 5.49941C1.66669 5.06985 2.03978 4.72163 2.50002 4.72163H5.83335ZM7.7441 3.39388C7.90038 3.24802 8.11234 3.16608 8.33335 3.16608H11.6667C11.8877 3.16608 12.0997 3.24802 12.2559 3.39388C12.4122 3.53974 12.5 3.73757 12.5 3.94385V4.72163H7.50002V3.94385C7.50002 3.73757 7.58782 3.53974 7.7441 3.39388ZM5.00002 6.27719V16.3883C5.00002 16.5946 5.08782 16.7924 5.2441 16.9383C5.40038 17.0841 5.61234 17.1661 5.83335 17.1661H14.1667C14.3877 17.1661 14.5997 17.0841 14.7559 16.9383C14.9122 16.7924 15 16.5946 15 16.3883V6.27719H5.00002Z" fill={fill} />
  </svg>
);

export const Lock: React.FC<IconProps> = ({
  fill = "currentColor", 
  width = "12", 
  height = "14",
  className,
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 12 14" fill="none" className={classNames(className)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M2 4.33325C2 2.12411 3.79086 0.333252 6 0.333252C8.20914 0.333252 10 2.12411 10 4.33325V5.10013C10.1884 5.14142 10.3692 5.20154 10.544 5.29057C11.0457 5.54623 11.4537 5.95418 11.7094 6.45594C11.8742 6.7795 11.9399 7.12397 11.9705 7.4987C12 7.85949 12 8.3024 12 8.83904V9.82747C12 10.3641 12 10.807 11.9705 11.1678C11.9399 11.5425 11.8742 11.887 11.7094 12.2106C11.4537 12.7123 11.0457 13.1203 10.544 13.3759C10.2204 13.5408 9.87595 13.6065 9.50122 13.6371C9.14042 13.6666 8.69752 13.6666 8.16088 13.6666H3.83912C3.30248 13.6666 2.85958 13.6666 2.49878 13.6371C2.12405 13.6065 1.77958 13.5408 1.45603 13.3759C0.95426 13.1203 0.546312 12.7123 0.29065 12.2106C0.125789 11.887 0.0600798 11.5425 0.029463 11.1678C-1.52091e-05 10.807 -8.21607e-06 10.3641 2.87528e-07 9.82745L2.87528e-07 8.83905C-8.21607e-06 8.30241 -1.52091e-05 7.8595 0.029463 7.4987C0.0600798 7.12397 0.125789 6.7795 0.29065 6.45594C0.546312 5.95418 0.954261 5.54623 1.45603 5.29057C1.63076 5.20154 1.8116 5.14142 2 5.10013V4.33325ZM3.33333 5.001C3.49181 4.99991 3.66026 4.99992 3.83913 4.99992H8.16087C8.33974 4.99992 8.50819 4.99991 8.66667 5.001V4.33325C8.66667 2.86049 7.47276 1.66659 6 1.66659C4.52724 1.66659 3.33333 2.86049 3.33333 4.33325V5.001ZM2.60736 6.35829C2.31508 6.38217 2.16561 6.42545 2.06135 6.47858C1.81046 6.60641 1.60649 6.81038 1.47866 7.06126C1.42553 7.16553 1.38225 7.315 1.35837 7.60728C1.33385 7.90734 1.33333 8.29553 1.33333 8.86659V9.79992C1.33333 10.371 1.33385 10.7592 1.35837 11.0592C1.38225 11.3515 1.42553 11.501 1.47866 11.6052C1.60649 11.8561 1.81046 12.0601 2.06135 12.1879C2.16561 12.2411 2.31508 12.2843 2.60736 12.3082C2.90742 12.3327 3.29561 12.3333 3.86667 12.3333H8.13333C8.70439 12.3333 9.09258 12.3327 9.39264 12.3082C9.68492 12.2843 9.83439 12.2411 9.93865 12.1879C10.1895 12.0601 10.3935 11.8561 10.5213 11.6052C10.5745 11.501 10.6178 11.3515 10.6416 11.0592C10.6661 10.7592 10.6667 10.371 10.6667 9.79992V8.86659C10.6667 8.29553 10.6661 7.90734 10.6416 7.60728C10.6178 7.315 10.5745 7.16553 10.5213 7.06126C10.3935 6.81038 10.1895 6.60641 9.93865 6.47858C9.83439 6.42545 9.68492 6.38217 9.39264 6.35829C9.09258 6.33377 8.70439 6.33325 8.13333 6.33325H3.86667C3.29561 6.33325 2.90742 6.33377 2.60736 6.35829ZM6 7.99992C6.36819 7.99992 6.66667 8.2984 6.66667 8.66659V9.99992C6.66667 10.3681 6.36819 10.6666 6 10.6666C5.63181 10.6666 5.33333 10.3681 5.33333 9.99992V8.66659C5.33333 8.2984 5.63181 7.99992 6 7.99992Z" fill={fill} />
  </svg>
);