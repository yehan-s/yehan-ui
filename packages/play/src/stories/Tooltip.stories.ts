import type { StoryObj, Meta } from "@storybook/vue3";
import { fn } from "@storybook/test";
import { YeTooltip } from "yehan-ui";

type Story = StoryObj<typeof YeTooltip>;

const meta: Meta<typeof YeTooltip> = {
  title: "Example/Tooltip",
  component: YeTooltip,
  tags: ["autodocs"],
  argTypes: {
    trigger: {
      options: ["hover", "click", "contextmenu"],
      control: {
        type: "select",
      },
    },
    placement: {
      options: ["top", "bottom", "left", "right"],
      control: {
        type: "select",
      },
    },
  },
  args: {
    "onVisible-change": fn(),
  },
};

export const Default: Story = {
  args: {
    content: "This is a tooltip",
    placement: "top",
    trigger: "hover",
  },
  render: (args) => ({
    components: { YeTooltip },
    setup() {
      return {
        args,
      };
    },
    template: `
      <YeTooltip v-bind="args">
          <div style="height:30px;width:200px;background:red;padding:auto">trigger</div>
      </YeTooltip>
    `,
  }),
};
export default meta;