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
import React, { useRef, useEffect, createRef } from 'react';
import { styled, getSequentialSchemeRegistry } from '@superset-ui/core';
import { ECharts, init } from 'echarts';
import { BarRichTextProps, BarRichTextStylesProps } from './types';

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<BarRichTextStylesProps>`
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height};
  width: ${({ width }) => width};

  h3 {
    /* You can use your props to control CSS! */
    font-size: ${({ theme, headerFontSize }) => theme.typography.sizes[headerFontSize]};
    font-weight: ${({ theme, boldText }) => theme.typography.weights[boldText ? 'bold' : 'normal']};
  }
`;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function BarRichText(props: BarRichTextProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { echartOptions, height, width } = props;

  const rootElem = createRef<HTMLDivElement>();
  const chartRef = useRef<ECharts>();

  // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    if (!rootElem.current) return;
    if (!chartRef.current) {
      chartRef.current = init(rootElem.current);
    }
    chartRef.current.setOption(echartOptions, true);
  }, [echartOptions]);

  useEffect(() => {
    const colorScale = getSequentialSchemeRegistry().get(props.linearColorScheme);
    if (!rootElem.current) return;
    if (!chartRef.current) {
      chartRef.current = init(rootElem.current);
    }
    echartOptions.color = colorScale?.colors;

    echartOptions.xAxis.name = props.xAxisLabel;
    echartOptions.yAxis.name = props.yAxisLabel;

    echartOptions.legend.show = props.showLegend;
    echartOptions.legend.type = props.legend;

    let yaxisHeight = height;
      if(echartOptions.legend.data.length > 0){
        yaxisHeight = (echartOptions.legend.data.length * echartOptions.series[0]['data'].length)*5;
      }
      console.log(echartOptions.series[0]['data'].length,echartOptions.legend.data.length)
      yaxisHeight = yaxisHeight < height ? height : yaxisHeight;
      yaxisHeight = yaxisHeight > 5000 ? 5000 : yaxisHeight;
      
      chartRef.current.resize({ width, height:yaxisHeight });
    
    chartRef.current.setOption(echartOptions, true);
  }, [echartOptions]);

  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}
    ></Styles>
  );
}
