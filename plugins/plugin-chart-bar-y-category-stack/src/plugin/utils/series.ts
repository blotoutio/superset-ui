/* eslint-disable no-underscore-dangle */
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
import { DataRecord, DataRecordValue, NumberFormatter, TimeFormatter } from '@superset-ui/core';
export const NULL_STRING = '<NULL>';

export function formatSeriesName(
  name: DataRecordValue | undefined,
  {
    numberFormatter,
    timeFormatter,
  }: {
    numberFormatter?: NumberFormatter;
    timeFormatter?: TimeFormatter;
  } = {},
): string {
  if (name === undefined || name === null) {
    return NULL_STRING;
  }
  if (typeof name === 'number') {
    return numberFormatter ? numberFormatter(name) : name.toString();
  }
  if (typeof name === 'boolean') {
    return name.toString();
  }
  if (name instanceof Date) {
    return timeFormatter ? timeFormatter(name) : name.toISOString();
  }
  return name;
}

export function extractGroupbyLabel({
  datum,
  groupby,
  numberFormatter,
  timeFormatter,
}: {
  datum: DataRecord;
  groupby: string[];
  numberFormatter?: NumberFormatter;
  timeFormatter?: TimeFormatter;
}): string {
  return groupby
    .map(val => formatSeriesName(datum[val], { numberFormatter, timeFormatter }))
    .join(', ');
}

export function extractBreakdownbyLabel({
  datum,
  columns,
  numberFormatter,
  timeFormatter,
}: {
  datum: DataRecord;
  columns: string[];
  numberFormatter?: NumberFormatter;
  timeFormatter?: TimeFormatter;
}): string {
  return columns
    .map(val => formatSeriesName(datum[val], { numberFormatter, timeFormatter }))
    .join(', ');
}

export function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}

export function hasNotNull(value: any, index: any, self: any) {
  return !value.includes(', null') && !value.includes('<NULL>');
}

let config = {
  rotate: 90,
  align: 'left',
  verticalAlign: 'middle',
  position: 'insideBottom',
  distance: 15,
};

let app = { config };

var labelOption = {
  show: true,
  position: app.config.position,
  distance: app.config.distance,
  align: app.config.align,
  verticalAlign: app.config.verticalAlign,
  rotate: app.config.rotate,
  formatter: '{c}  {name|{a}}',
  fontSize: 16,
  rich: {
    name: {},
  },
};

export function getSeriesData({
  data,
  groupkeys,
  groupby,
  metric,
  columnskeys,
  columns,
}: {
  data: any;
  groupkeys: string[];
  groupby: string[];
  metric: string;
  columnskeys: string[];
  columns: string[];
}) {
  if (columnskeys.length > 0) {
    let finalresult: any = [];
    columnskeys.forEach((datum: any, key) => {
      let result: any = [];
      const columnValues = datum.split(',');
      const columnObj = Object.fromEntries(
        groupby.map((_, i) => [columns[i], columnValues[i].trim()]),
      );

      groupkeys.forEach((datum1: any, key1) => {
        const groupValues = datum1.split(',');
        const groupObj = Object.fromEntries(
          groupby.map((_, i) => [groupby[i], groupValues[i].trim()]),
        );
        const filterobj = { ...columnObj, ...groupObj };
        const resultObj = findByMatchingPropertiesValues(data, filterobj);
        if (resultObj[0] != undefined) {
          const label = typeof metric == 'string' ? metric : metric['label'];
          result.push(resultObj[0][label]);
        } else {
          result.push(0);
        }
      });
      let obj = {
        name: datum,
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        data: result,
      };
      finalresult.push(obj);
    });

    return finalresult;
  }

  let result: number[] = [];
  groupkeys.map(val => {
    let values = groupby.length > 1 ? val.split(',') : [val];
    let keyValObj = Object.fromEntries(groupby.map((_, i) => [groupby[i], values[i].trim()]));
    let filterData = findByMatchingPropertiesValues(data, keyValObj);
    const label = typeof metric == 'string' ? metric : metric['label'];
    result.push(filterData[0][label]);
  });

  return [
    {
      type: 'bar',
      stack: 'total',
      label: {
        show: true,
      },
      data: result,
    },
  ];
}

function findByMatchingPropertiesValues(set: any, properties: any) {
  return set.filter((entry: any) => {
    return Object.keys(properties).every(key => {
      return entry[key] + '' === properties[key];
    });
  });
}
