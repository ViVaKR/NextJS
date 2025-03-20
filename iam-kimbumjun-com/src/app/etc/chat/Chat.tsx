'use client';

import { Box, TextField } from '@mui/material';
import styles from './Chat.module.css';
import Image from 'next/image';

export default function ChatPage() {
  return (
    <div className={`${styles.chatClientContainer} relative`}>
      <div className={`${styles.chatContainer}`}>
        <ul className={`${styles.chat} !py-2`}>
          <li className={`${styles.message}`}>
            <Image
              src={`/images/avata-1024.png`}
              width={50}
              height={20}
              className="logo z-50 rounded-full"
              alt=""
            />
            <p className="!text-sm !text-slate-500">팍팍</p>
            <pre>
              <code>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque
                animi rem voluptatem dolor impedit. Fugiat eum iste,
                exercitationem facere quaerat quos distinctio tempore, culpa,
                ullam aliquid ad minus aperiam natus.
              </code>
            </pre>
          </li>
        </ul>
      </div>
      {/* footer */}
      <footer className="h-1/4 text-white w-full px-8 pt-0">
        <div
          className="flex flex-col justify-center
                items-center left-0 right-0 max-h-screen
                absolute
                bottom-0">
          <Box
            component="form"
            className="w-full  text-white absolute bottom-52 mb-1"
            noValidate
            autoComplete="off">
            <div>
              <TextField
                id="filled-multiline-static"
                label="Message"
                focused
                multiline
                fullWidth
                variant="filled"
                rows={5}
                sx={{
                  // ? Text
                  '& .MuiFilledInput-root': {
                    color: '#fff',
                    fontFamily: 'var(--font-noto)',
                    fontWeight: 'normal',
                    fontSize: '18px',
                    //? Border
                  },
                  //? Label
                  '& .MuiInputLabel-filled': {
                    color: '#ffff00 !important',
                    fontWeight: 'bold',
                  },
                }}
                defaultValue=""
              />
            </div>
          </Box>

          <div className="flex gap-4 justify-around w-full absolute bottom-32 mb-0">
            <button className="px-8 py-4 font-poppins cursor-pointer rounded-full my-4 bg-sky-400 hover:bg-sky-600">
              Cancel
            </button>
            <button className="px-8 py-4 font-poppins cursor-pointer rounded-full my-4 bg-sky-400 hover:bg-sky-600">
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
