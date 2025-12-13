import React, { JSX, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import meApi from '@/api/meApi';
import generateCode from '@/utils/generateCode';

type Props = {
  onCancel?: () => void;
  visible: boolean;
  onSaveCodeRevoke?: (code: string) => void;
};

type FormValues = {
  oldpassword: string;
  password: string;
  confirm: string;
};

export default function ModalChangePassword({
  onCancel,
  visible,
  onSaveCodeRevoke,
}: Props): JSX.Element {
  const { register, handleSubmit, reset, getValues, formState } =
    useForm<FormValues>({
      defaultValues: { oldpassword: '', password: '', confirm: '' },
    });
  const { errors } = formState;

  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [passwordForRevoke, setPasswordForRevoke] = useState<string>('');

  const handleClose = () => {
    reset();
    if (onCancel) onCancel();
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await meApi.changePassword({
        oldPassword: data.oldpassword,
        newPassword: data.password,
      });
      window.alert('Đổi mật khẩu thành công');
      setPasswordForRevoke(data.password);
      setConfirmOpen(true);
      reset();
      handleClose();
    } catch (err) {
      window.alert('Mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeToken = async (password: string) => {
    try {
      const code = generateCode(20);
      if (onSaveCodeRevoke) onSaveCodeRevoke(code);
      const response = await meApi.revokeToken({ password, key: code });
      const { token, refreshToken } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      window.alert('Đăng xuất khỏi các thiết bị thành công');
    } catch (err) {
      window.alert('Đã có lỗi xảy ra');
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Dialog
        open={visible}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-4 text-sm font-medium text-gray-700">
                Mật khẩu hiện tại
              </label>
              <div className="col-span-8">
                <Input
                  type="password"
                  {...register('oldpassword', {
                    required: 'Vui lòng nhập mật khẩu cũ !',
                  })}
                />
                {errors.oldpassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.oldpassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-4 text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="col-span-8">
                <Input
                  type="password"
                  {...register('password', {
                    required: 'Vui lòng nhập mật khẩu!',
                    minLength: {
                      value: 8,
                      message: 'Mật khẩu phải có ít nhất 8 kí tự',
                    },
                    validate: (v) => {
                      const old = getValues('oldpassword')?.trim();
                      if (v && old === v)
                        return 'Mật khẩu mới không trùng với mật khẩu cũ';
                      return true;
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-4">
              <label className="col-span-4 text-sm font-medium text-gray-700">
                Nhập lại mật khẩu
              </label>
              <div className="col-span-8">
                <Input
                  type="password"
                  {...register('confirm', {
                    required: 'Vui lòng nhập lại mật khẩu',
                    validate: (v) => {
                      if (!v || getValues('password') === v) return true;
                      return '2 mật khẩu nhập không khớp với nhau';
                    },
                  })}
                />
                {errors.confirm && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirm.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex items-center justify-end space-x-2">
              <Button variant="ghost" type="button" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Thay đổi'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="w-full max-w-md">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-yellow-50">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium">
                Bạn có muốn đăng xuất ra khỏi các thiết bị khác ?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Khi chọn "Đồng ý" tất cả các tài khoản ở các thiết bị khác sẽ tự
                động đăng xuất
              </p>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end space-x-2 mt-6">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleRevokeToken(passwordForRevoke)}>
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
