/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { ChartProps, DataRecord } from '@superset-ui/core';
import { extractGroupbyLabel, extractColLabel, onlyUnique, getData } from './utils/series';
import { CustomProfileProps } from '../types';
import { graphic } from 'echarts';

export default function transformProps(chartProps: ChartProps): CustomProfileProps {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your CustomProfile.tsx file, but
   * doing supplying custom props here is often handy for integrating third
   * party libraries that rely on specific props.
   *
   * A description of properties in `chartProps`:
   * - `height`, `width`: the height/width of the DOM element in which
   *   the chart is located
   * - `formData`: the chart data request payload that was sent to the
   *   backend.
   * - `queriesData`: the chart data response payload that was received
   *   from the backend. Some notable properties of `queriesData`:
   *   - `data`: an array with data, each row with an object mapping
   *     the column/alias to its value. Example:
   *     `[{ col1: 'abc', metric1: 10 }, { col1: 'xyz', metric1: 20 }]`
   *   - `rowcount`: the number of rows in `data`
   *   - `query`: the query that was issued.
   *
   * Please note: the transformProps function gets cached when the
   * application loads. When making changes to the `transformProps`
   * function during development with hot reloading, changes won't
   * be seen until restarting the development server.
   */
  const { width, height, formData, queriesData } = chartProps;
  const { groupby, metrics, series, boldText, headerFontSize, headerText } = formData;
  const data: DataRecord[] = queriesData[0].data || [];

  const groupkeys = data.map(datum => extractGroupbyLabel({ datum, groupby })).filter(onlyUnique);
  const colkeys = data.map(datum => extractColLabel({ datum, series })).filter(onlyUnique);
  const transformedData = getData({
    data,
    series,
    groupkeys,
    groupby,
    metrics,
    colkeys,
  });
  const renderItem = (params: any, api: any) => {
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1] * 0.6;

    var rectShape = graphic.clipRectByRect(
      {
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height,
      },
      {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height,
      },
    );

    return (
      rectShape && {
        type: 'rect',
        transition: ['shape'],
        shape: rectShape,
        style: api.style(),
      }
    );
  };

  const echartOptions = {
    tooltip: {
      formatter: function (params: any) {
        return params.marker + params.name + ': ' + params.value[3];
      },
    },
    title: {
      text: 'Profile',
      left: 'center',
    },
    dataZoom: [
      {
        type: 'slider',
        filterMode: 'weakFilter',
        showDataShadow: false,
        top: 400,
        labelFormatter: '',
      },
      {
        type: 'inside',
        filterMode: 'weakFilter',
      },
    ],
    grid: {
      height: 300,
    },
    xAxis: {
      min: 1,
      scale: true,
    },
    yAxis: {
      data: groupkeys,
    },
    series: [
      {
        type: 'custom',
        renderItem: renderItem,
        itemStyle: {
          opacity: 0.8,
        },
        encode: {
          x: [1, 2],
          y: 0,
        },
        data: transformedData,
      },
    ],
  };

  return {
    width,
    height,
    echartOptions,
    // and now your control data, manipulated as needed, and passed through as props!
    boldText,
    headerFontSize,
    headerText,
  };
}
