import type { Meta, StoryObj } from '@storybook/vue3'
import { YeCollapse, YeCollapseItem } from 'yehan-ui'

type Story = StoryObj<typeof YeCollapse>

const meta: Meta<typeof YeCollapse> = {
  title: 'Example/Collapse',
  component: YeCollapse,
  subcomponents: { YeCollapseItem },
  tags: ['autodocs'],
}

export const Default: Story = {
  render: (args: any) => ({
    components: {
      YeCollapse,
      YeCollapseItem,
    },
    setup() {
      return {
        args,
      }
    },
    template: `
    <ye-collapse v-bind="args">
      <ye-collapse-item name="a" title="Title a">
        <div>this is content a</div>
      </ye-collapse-item>
      <ye-collapse-item name="b" title="title b">
        <div>this is content b</div>
      </ye-collapse-item>
      <ye-collapse-item name="c" title="title c  disable" disabled>
        <div>this is content c</div>
      </ye-collapse-item>
    </ye-collapse>
    `,
  }),
  args: {
    accordion: true,
    modelValue: ['a'],
  },
}

export default meta
