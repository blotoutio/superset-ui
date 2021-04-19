## @superset-ui/plugin-chart-sankey-node-align-right

This plugin provides Sankey Node Align Right for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to
lookup this chart throughout the app.

```js
import SankeyNodeAlignRightChartPlugin from '@superset-ui/plugin-chart-sankey-node-align-right';

new SankeyNodeAlignRightChartPlugin().configure({ key: 'sankey-node-align-right' }).register();
```

Then use it via `SuperChart`. See
[storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-sankey-node-align-right)
for more details.

```js
<SuperChart
  chartType="sankey-node-align-right"
  width={600}
  height={600}
  formData={...}
  queriesData={[{
    data: {...},
  }]}
/>
```

### File structure generated

```
├── package.json
├── README.md
├── tsconfig.json
├── src
│   ├── SankeyNodeAlignRight.tsx
│   ├── images
│   │   └── thumbnail.png
│   ├── index.ts
│   ├── plugin
│   │   ├── buildQuery.ts
│   │   ├── controlPanel.ts
│   │   ├── index.ts
│   │   └── transformProps.ts
│   └── types.ts
├── test
│   └── index.test.ts
└── types
    └── external.d.ts
```
