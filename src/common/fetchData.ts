// 网络请求封装，第一个范型是返回的数据类型，第二个范型是请求参数的类型
type Options = {
  url: string;
};
type successNumber = 200 | 201;
type failNumber = 500 | 404 | 401;

// 函数重载
async function fetchData<Data>(
  method: 'GET',
  options: Options
): Promise<
  { code: successNumber; message: 'success'; data: Data } | { code: failNumber; message: 'fail'; data: string }
>;
async function fetchData<Data, Params>(
  method: 'POST',
  options: Options,
  params: Params
): Promise<
  { code: successNumber; message: 'success'; data: Data } | { code: failNumber; message: 'fail'; data: string }
>;

// 函数实现
async function fetchData<Data, Params>(
  method: 'GET' | 'POST',
  options: Options,
  params?: Params
): Promise<
  { code: successNumber; message: 'success'; data: Data } | { code: failNumber; message: 'fail'; data: string }
> {
  const { url } = options;
  if (method === 'GET') {
    try {
      const response = await fetch(url);
      if (response.status === 404) {
        throw new Error('404');
      }
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
    }
  }
  if (method === 'POST') {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      if (response.status === 404) {
        throw new Error('404');
      }
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
    }
  }
  throw new Error('method is not supported');
}

export { fetchData };
