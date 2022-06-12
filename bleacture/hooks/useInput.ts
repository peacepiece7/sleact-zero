import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
// 매개변수 리턴에 type을 붙여줘야함, 변수는 추론함 못하면 타입적어야함 제너릭이라는데 무슨 말인지 하나도 모르겠음
type ReturnTypes<T = any> = [T, (e: React.ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

const useInput = <T>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    //prettier-ignore
    if(e?.target?.value) setValue((e.target.value as unknown) as T);
    else console.log('plz check the follwing event :', e)
  }, []);
  return [value, handler, setValue];
};

export default useInput;
