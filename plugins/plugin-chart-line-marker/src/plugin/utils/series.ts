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
import moment from 'moment';
export const NULL_STRING = 'null';

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

export function extractXaxisLabel({ datum }: { datum: any }): string {
  return moment(datum['__timestamp']).format('MMM DD');
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

export function hasNotNull(value: any, index: any, self: any) {
  return !value.includes(', null');
}

export function getSeriesData({
  data,
  groupkeys,
  groupby,
  metrics,
}: {
  data: any;
  groupkeys: string[];
  groupby: string[];
  metrics: string[];
}) {
  return groupkeys.map((datum: any) => {
    let result = [];
    let values = datum.split(',');
    let keyValObj = Object.fromEntries(groupby.map((_, i) => [groupby[i], values[i].trim()]));
    result = findByMatchingProperties(data, keyValObj, metrics);

    return {
      name: datum,
      type: 'line',
      data: result,
      markPoint: {
        data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Minimum' },
        ],
      },
      markLine: {
        data: [{ type: 'average', name: 'average' }],
      },
    };
  });
}

const findByMatchingProperties = (set: any, properties: any, metrics: string[]) => {
  return set.map((entry: any) => {
    let result = Object.keys(properties).every(function (key) {
      return entry[key] === properties[key];
    });
    if (result) {
      const label = typeof metrics[0] == 'string' ? metrics[0] : metrics[0]['label'];
      return entry[label];
    } else {
      return null;
    }
  });
};
