'use client';

import { VivButton, DefaultButton } from '@/components/Button';
import { useState } from 'react';

export default function Settings() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <p> 현재 카운트 {count}</p>

        <div className="m-2 w-full grid grid-cols-4 gap-2 my-4">
          <DefaultButton
            text="Click Demo"
            click={(e) => {
              setCount(count + 1);
            }}
          />
          <VivButton
            color="black"
            text="Black"
            fontSize="base"
            buttonSize="medium"
            click={(e) => setCount(count + 2)}
          />

          <VivButton
            color="blue"
            text="Blue"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="red"
            text="Red"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="orange"
            text="orange"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="amber"
            text="amber"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="yellow"
            text="yellow"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="lime"
            text="lime"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="green"
            text="green"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="emerald"
            text="emerald"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="teal"
            text="teal"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="cyan"
            text="cyan"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="sky"
            text="sky"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="indigo"
            text="indigo"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="violet"
            text="violet"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="fuchsia"
            text="fuchisia"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="pink"
            text="pink"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="rose"
            text="rose"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="slate"
            text="slate"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="gray"
            text="gray"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="zinc"
            text="zinc"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="neutral"
            text="neutral"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="stone"
            text="stone"
            fontSize="base"
            buttonSize="medium"
          />

          <VivButton
            color="white"
            text="White"
            fontSize="base"
            buttonSize="medium"
          />
        </div>
      </div>
    </>
  );
}
