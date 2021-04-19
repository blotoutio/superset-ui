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
import { minBy } from 'lodash';
export const NULL_STRING = '<NULL>';

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const findByMatchingPropertiesValues = (set: any, properties: any) => {
  return set.filter((entry: any) => {
    return Object.keys(properties).every(key => {
      return entry[key] + '' === properties[key];
    });
  });
};

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

export function getTypeData({ colkeys }: { colkeys: string[] }) {
  let typeArr: any = [];
  colkeys.forEach(function (col, index) {
    typeArr.push({ name: col, color: getRandomColor() });
  });
  return typeArr;
}

export function getData({
  data,
  series,
  groupkeys,
  groupby,
  metrics,
  colkeys,
}: {
  data: any;
  series: string;
  groupkeys: string[];
  groupby: string[];
  metrics: string[];
  colkeys: string[];
}) {
  const typeData = getTypeData({ colkeys });
  let transformedData: any = [];
  const label = typeof metrics[0] == 'string' ? metrics[0] : metrics[0]['label'];
  groupkeys.forEach((val, index) => {
    var baseVal: any = minBy(data, label);
    let values = val.split(',');
    let keyValObj = Object.fromEntries(groupby.map((_, i) => [groupby[i], values[i].trim()]));
    let filterData = findByMatchingPropertiesValues(data, keyValObj);

    filterData.forEach((filterDataVal: any, filterDataIndex: any) => {
      let tIdx = typeData.findIndex((item: any) => {
        return item['name'] == filterDataVal[series];
      });

      transformedData.push({
        name: filterDataVal.ts,
        value: [
          index,
          baseVal[label],
          (baseVal[label] += filterDataVal[label]),
          filterDataVal[label],
        ],
        itemStyle: {
          normal: {
            color: typeData[tIdx]['color'],
          },
        },
      });
    });
  });

  return transformedData;
}
