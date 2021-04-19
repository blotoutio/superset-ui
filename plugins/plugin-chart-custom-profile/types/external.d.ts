declare module '*.png' {
  const value: any;
  export default value;
}

interface ChartsDataObject {
  itemStyle: itemStyleData;
  name: string;
  value: number[];
}

interface ChartsData {
  [key: string]: ChartsDataObject;
}

interface itemStyleData {
  normal: {
    color: string;
  };
}
