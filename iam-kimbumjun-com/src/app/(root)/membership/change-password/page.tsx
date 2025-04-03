'use client'
// import { postCodes } from "@/lib/fetchCodes";
// import { useSnackbar } from "@/lib/SnackbarContext";
// import { CodeData } from "@/types/code-form-data";
import { Box, Button, TextField } from "@mui/material";
// import { useRouter } from "next/router";
// import { useForm, Controller } from "react-hook-form";

export default function ChangePasswordPage() {

  // const { showSnackbar } = useSnackbar();
  // const router = useRouter();

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors, isDirty, isLoading, isSubmitting },
  //   watch,
  //   reset,
  //   setValue
  // } = useForm({
  //   defaultValues: {
  //     email: ''
  //   },
  //   mode: 'onTouched'

  // });

  // const onSubmit = async (data: string) => {
  //   try {
  //     const response = await postCodes(data);
  //     if (response) {
  //       showSnackbar(`${response.message}`, `${response.isSuccess ? 'success' : 'warning'}`);
  //       if (response.isSuccess) {
  //         reset();
  //         router.push('/code'); // 목록 페이지로 이동
  //       }
  //     }
  //   } catch (err: any) {
  //     showSnackbar(err.message, 'error')
  //   }
  // };

  return (
    <>
      <h1>ChangePasswordPage</h1>

      <Box sx={{
        px: 2,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>

        {/* <form autoComplete="off"
          className="flex flex-col gap-5 w-full"
        // onSubmit={handleSubmit('')}
        >
          <Controller
            name="email"
            control={control}
            rules={{ required: '수신할 이메일을 입력해 주세요.' }}

            render={({ field }) => (
              <TextField
                {...field}
                label="제목"
                variant="filled"
                error={!!errors.email}
                sx={{ my: '0px' }}
                color='success'
                helperText={errors.email?.message}
                fullWidth
              />
            )}
          />


        </form> */}


      </Box>
    </>
  );
}
