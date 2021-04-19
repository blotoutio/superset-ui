## @superset-ui/plugin-chart-sankey-itemstyle

This plugin provides Sankey Itemstyle for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to
lookup this chart throughout the app.

```js
import SankeyItemstyleChartPlugin from '@superset-ui/plugin-chart-sankey-itemstyle';

new SankeyItemstyleChartPlugin().configure({ key: 'sankey-itemstyle' }).register();
```

Then use it via `SuperChart`. See
[storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-sankey-itemstyle)
for more details.

```js
<SuperChart
  chartType="sankey-itemstyle"
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
│   ├── SankeyItemstyle.tsx
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
