import classNames from "classnames";
import ContactForm from "@ui/components/organisms/default/ContactForm";
import { getBlockOptions } from "@ui/components/organisms/default/BlockWrapper";

export function ContactFormBlock(props: any) {
  const {
    heading,
    content,
    aside,
    gfData,
  } = props.data;

  return (
    <ContactForm
      heading={heading}
      content={content}
      aside={aside}
      gfData={gfData}
      blockOptions={getBlockOptions(props.data)}
      className={classNames("custom-block contact-form", props.className)}
      id={props.id}
    />
  );
}
