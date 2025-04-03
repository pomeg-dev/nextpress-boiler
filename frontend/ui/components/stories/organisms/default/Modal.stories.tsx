import type { Meta, StoryObj } from "@storybook/react";
import Button from "@ui/components/atoms/Button";
import Modal from "@ui/components/organisms/default/Modal";

const ContentPlaceholder: React.ReactNode = (
  <div className="flex h-full flex-col gap-sm rounded-lg bg-white p-[20px] pt-8 text-primary">
    <h3>This is a heading</h3>
    <p>
      Et ex nostrud in inani commodo inimicus omnium novum volumus officiis
      oportere liber. Et ex nostrud in inani commodo inimicus omnium novum
      volumus officiis.
    </p>
    <Button
      style="secondary"
      className="m-auto"
    >
      Close Modal
    </Button>
  </div>
);

const meta: Meta<typeof Modal> = {
  title: "Components/Organisms/Default/Modal",
  component: Modal,
  tags: ["autodocs"],
  args: {
    children: ContentPlaceholder,
    showModal: true,
    maxWidth: "500px",
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  globals: {
    colorScheme: "image",
  },
};