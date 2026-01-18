import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FastField, Form, Formik } from 'formik';
import * as Yup from 'yup';

import ServiceMe from '@/api/meApi';
import { setAvatarProfile } from '@/app/globalSlice';
import UploadAvatar from '@/components/UploadAvatar';

import UploadCoverImage from '@/components/UploadConverImage';
import DateOfBirthField from '@/components/Field/DateOfBirthField';
import GenderRadioField from '@/components/Field/GenderRadioField';
import InputFieldNotTitle from '@/components/Field/InputFieldNotTitle';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalUpdateProfileProps {
  isVisible?: boolean;
  onCancel?: (value?: boolean) => void;
  onSuccess?: () => void;
  loading?: boolean;
}

function ModalUpdateProfile({
  isVisible = false,
  onCancel,
  onSuccess,
}: ModalUpdateProfileProps) {
  const dispatch = useDispatch();

  const formRef = useRef(null);
  const refInitValue = useRef(null);

  const { user } = useSelector((state: any) => state.global);

  const [avatar, setAvatar] = useState(null);
  const [coverImg, setCoverImg] = useState(null);
  const [isClear, setIsClear] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleGetCoverImg = (img: any) => {
    setCoverImg(img);
  };

  const handleGetAvatar = (img: any) => {
    setAvatar(img);
  };

  useEffect(() => {
    if (isVisible) {
      setIsClear(false);
      refInitValue.current = {
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
      };
    }
  }, [isVisible]);

  const checkChangeValue = (value1: any, value2: any) => {
    if (value1.name !== value2.name) return false;
    if (value1.dateOfBirth !== value2.dateOfBirth) return false;
    if (value1.gender !== value2.gender) return false;
    return true;
  };

  const handleCancel = () => {
    onCancel?.(false);
    setIsClear(true);
    setCoverImg(null);
    setAvatar(null);
  };

  const handleSubmit = async (values: any) => {
    setConfirmLoading(true);

    try {
      if (!checkChangeValue(values, refInitValue.current)) {
        const { name, dateOfBirth, gender } = values;
        await ServiceMe.updateProfile({
          name,
          dateOfBirth,
          gender,
        });
      }

      if (coverImg) {
        const frmData = new FormData();
        frmData.append('file', coverImg);
        await ServiceMe.updateCoverImage(frmData);
      }

      if (avatar) {
        const frmData = new FormData();
        frmData.append('file', avatar);
        const response = await ServiceMe.updateAvatar(frmData);
        dispatch(setAvatarProfile(response.avatar));
      }
      setIsClear(true);
    } catch (error) {
      console.log(error);
    }

    setConfirmLoading(false);
    onCancel?.();
  };

  const handleOke = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="relative mb-16">
            <UploadCoverImage
              coverImg={user.coverImage}
              getFile={handleGetCoverImg}
              isClear={isClear}
            />
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <UploadAvatar
                avatar={user.avatar}
                getFile={handleGetAvatar}
                isClear={isClear}
              />
            </div>
          </div>

          <Formik
            innerRef={formRef}
            initialValues={{
              name: user.name,
              dateOfBirth: user.dateOfBirth,
              gender: user.gender ? 1 : 0,
            }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              name: Yup.string()
                .required('Tên không được bỏ trống')
                .max(100, 'Tên tối đa 100 kí tự'),
            })}
            enableReinitialize={true}
          >
            {() => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tên</label>
                  <FastField
                    name="name"
                    component={InputFieldNotTitle}
                    type="text"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ngày sinh</label>
                  <FastField name="dateOfBirth" component={DateOfBirthField} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Giới tính</label>
                  <FastField name="gender" component={GenderRadioField} />
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleOke} disabled={confirmLoading}>
            {confirmLoading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalUpdateProfile;
