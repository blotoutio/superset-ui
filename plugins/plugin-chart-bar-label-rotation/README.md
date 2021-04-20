## @superset-ui/plugin-chart-bar-label-rotation

This plugin provides Bar Label Rotation for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to
lookup this chart throughout the app.

```js
import BarLabelRotationChartPlugin from '@superset-ui/plugin-chart-bar-label-rotation';

new BarLabelRotationChartPlugin().configure({ key: 'bar-label-rotation' }).register();
```

Then use it via `SuperChart`. See
[storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-bar-label-rotation)
for more details.

```js
<SuperChart
  chartType="bar-label-rotation"
  width={600}
  height={600}
  formData={...}
  queryData={{
    data: {...},
  }}
/>
```

### File structure generated

```
├── package.json
├── README.md
├── tsconfig.json
├── src
│   ├── BarLabelRotation.tsx
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
