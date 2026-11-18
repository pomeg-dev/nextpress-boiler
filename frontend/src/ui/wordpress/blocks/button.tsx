import React from "react";
import type { BlockComponentProps } from "@pomeg-dev/nextpress-client";
import Button from "@ui/components/atoms/Button";

// Site override of core/button: renders the brand Button atom.
const ButtonBlock: React.FC<BlockComponentProps> = ({ parser, language, ...block }) => {
  const { data } = block;
  const extractButtonProps = (html: string) => {
    let buttonProps = {
      href: "#",
      target: "",
      rel: "",
      text: "Button"
    };

    const anchorRegex = /<a[^>]*class="[^"]*wp-block-button__link[^"]*"[^>]*>(.*?)<\/a>/;
    const hrefRegex = /href="([^"]*)"/;
    const targetRegex = /target="([^"]*)"/;
    const relRegex = /rel="([^"]*)"/;
    
    const anchorMatch = html.match(anchorRegex);
    
    if (anchorMatch) {
      const anchorTag = anchorMatch[0];
      const innerText = anchorMatch[1];
      
      const hrefMatch = anchorTag.match(hrefRegex);
      const targetMatch = anchorTag.match(targetRegex);
      const relMatch = anchorTag.match(relRegex);
      
      buttonProps = {
        href: hrefMatch ? hrefMatch[1] : "#",
        target: targetMatch ? targetMatch[1] : "",
        rel: relMatch ? relMatch[1] : "",
        text: innerText ? innerText.trim() : "Button"
      };
    }

    return buttonProps;
  };

  const buttonProps = extractButtonProps(block.innerHTML);
  // The editor's Outline style renders the secondary (outlined) button.
  const isOutline = `${block?.className ?? ""} ${data?.className ?? ""}`.includes("is-style-outline");

  return (
    <Button
      size="md"
      style={isOutline ? "secondary" : "primary"}
      iconRight="ArrowRight"
      linkItem={{
        url: buttonProps.href,
        target: buttonProps.target,
        title: buttonProps.text,
      }}
    />
  );
};

export default ButtonBlock;