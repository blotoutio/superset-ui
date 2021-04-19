## @superset-ui/plugin-chart-pie-doughnut



This plugin provides Pie Doughnut for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import PieDoughnutChartPlugin from '@superset-ui/plugin-chart-pie-doughnut';

new PieDoughnutChartPlugin()
  .configure({ key: 'pie-doughnut' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-pie-doughnut) for more details.

```js
<SuperChart
  chartType="pie-doughnut"
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
│   ├── PieDoughnut.tsx
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