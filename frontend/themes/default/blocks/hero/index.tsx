import cn from "classnames";
import Image from "next/image";

export function hero(props: any) {
  return (
    <div className="hero container mt-[40px]">
      <div className="hero__content flex min-h-[500px] w-full flex-col justify-end rounded-lg bg-primary p-[40px] text-white">
        {props?.data?.pre_heading &&
          <div
            dangerouslySetInnerHTML={{ __html: props.data.pre_heading }}
          />
        }
        {props?.data?.heading &&
          <div
            dangerouslySetInnerHTML={{ __html: props.data.heading }}
            className=""
          />
        }
        {/* <a href={props.data.cta.url} target={props.data.cta.target}>
          {props.data.cta.title}
        </a> */}
      </div>
    </div>
  );
}
