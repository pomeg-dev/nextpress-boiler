import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

export function ctasection(props: any) {
  return (
    <div
      className="ctasection py-[120px]"
      style={{
        backgroundColor: props.data.bg_color,
        color: props.data.text_color,
      }}
    >
      <div className="ctasection__content mx-auto flex max-w-[1000px] flex-col gap-[20px] px-[20px]">
        <div dangerouslySetInnerHTML={{ __html: props.data.text }} />
        <div className="ctasection__ctas flex gap-[10px]">
          {props.data.ctas &&
            props.data.ctas.map((cta: any) => (
              <a href={cta.cta.url}>
                <button>{cta.cta.title}</button>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}

// [
//   {
//     "id": "text",
//     "type": "wysiwyg"
//   },
//   {
//     "id": "ctas",
//     "type": "repeater",
//     "fields": [
//       {
//         "id": "cta",
//         "type": "link"
//       }
//     ]
//   },
//   {
//     "id": "bg_color",
//     "type": "color_picker"
//   },
//   {
//     "id": "text_color",
//     "type": "color_picker"
//   }
// ]
