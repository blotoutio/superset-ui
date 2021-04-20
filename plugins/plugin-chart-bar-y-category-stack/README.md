## @superset-ui/plugin-chart-bar-y-category-stack

This plugin provides Bar Y Category Stack for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to
lookup this chart throughout the app.

```js
import BarYCategoryStackChartPlugin from '@superset-ui/plugin-chart-bar-y-category-stack';

new BarYCategoryStackChartPlugin().configure({ key: 'bar-y-category-stack' }).register();
```

Then use it via `SuperChart`. See
[storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-bar-y-category-stack)
for more details.

```js
<SuperChart
  chartType="bar-y-category-stack"
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
│   ├── BarYCategoryStack.tsx
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
