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

export function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}

export function getKeys({ groupkeys }: { groupkeys: string[] }) {
  let typeArr: any = [];
  groupkeys.forEach(function (val, index) {
    const valArray = val.split(', ');
    typeArr = typeArr.concat(valArray);
  });
  return typeArr;
}

export function getData({ groupkeys }: { groupkeys: string[] }) {
  let keys = getKeys({ groupkeys });
  return keys.map((datum: any) => {
    return {
      name: datum,
    };
  });
}

export function getLinkData({
  data,
  groupby,
  metrics,
}: {
  data: any;
  groupby: string[];
  metrics: string[];
}) {
  const label = typeof metrics[0] == 'string' ? metrics[0] : metrics[0]['label'];
  return data.map((datum: any) => {
    return {
      source: datum[groupby[0]],
      target: datum[groupby[1]],
      value: datum[label],
    };
  });
}
