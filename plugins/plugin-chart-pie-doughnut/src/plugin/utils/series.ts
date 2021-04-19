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
  cols,
  numberFormatter,
  timeFormatter,
}: {
  datum: DataRecord;
  cols: string[];
  numberFormatter?: NumberFormatter;
  timeFormatter?: TimeFormatter;
}): string {
  return cols
    .map(val => formatSeriesName(datum[val], { numberFormatter, timeFormatter }))
    .join(', ');
}

export function extractColLabel({
  datum,
  series,
  numberFormatter,
  timeFormatter,
}: {
  datum: DataRecord;
  series: string;
  numberFormatter?: NumberFormatter;
  timeFormatter?: TimeFormatter;
}): string {
  return formatSeriesName(datum[series], { numberFormatter, timeFormatter });
}

export function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}

export function getSeriesData({
  data,
  groupkeys,
  cols,
  metrics,
  colkeys,
}: {
  data: any;
  groupkeys: string[];
  cols: string[];
  metrics: string[];
  colkeys: string[];
}) {
  return colkeys.map((datum: any) => {
    let chartdata: any = [];
    groupkeys.map((val: any) => {
      let values = cols.length > 1 ? val.split(',') : [val];
      let keyValObj = Object.fromEntries(cols.map((_, i) => [cols[i], values[i].trim()]));
      let filterData = findByMatchingPropertiesValues(data, keyValObj);
      const label = typeof metrics[0] == 'string' ? metrics[0] : metrics[0]['label'];
      let result = filterData.map((value: any) => ({ name: val, value: value[label] }));
      if (result.length > 0) {
        chartdata = chartdata.concat(result);
      }
    });

    return chartdata;
  });
}

function findByMatchingPropertiesValues(set: any, properties: any) {
  return set.filter((entry: any) => {
    return Object.keys(properties).every(key => {
      return entry[key] + '' === properties[key];
    });
  });
}
