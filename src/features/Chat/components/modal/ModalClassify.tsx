import { useEffect, useRef, useState } from 'react';

import { ArrowLeft, Edit, Info, Plus, Tag, Trash } from 'lucide-react';
import { toast } from 'sonner';

import ServiceClassify from '@/api/classifyApi';
import { useAddClassify } from '@/hooks/classify/useAddClassify';
import { useDeleteClassify } from '@/hooks/classify/useDeleteClassify';
import { useGetListColor } from '@/hooks/classify/useGetColors';
import { useGetListClassify } from '@/hooks/classify/useGetListClassify';
import { useUpdateClassifyMutation } from '@/hooks/classify/useUpdateClassify';
import { createQueryKey } from '@/queries/core';
import { useQueryClient } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ModalClassifyProps {
  isVisible: boolean;
  onCancel: () => void;
  onOpen: () => void;
}

function ModalClassify({ isVisible, onCancel, onOpen }: ModalClassifyProps) {
  const queryClient = useQueryClient();
  const previousName = useRef<any>(null);
  const { classifies } = useGetListClassify();
  const { colors } = useGetListColor();

  const { mutateAsync: addClassify } = useAddClassify();
  const { mutateAsync: updateClassify } = useUpdateClassifyMutation();
  const { mutateAsync: deleteClassify } = useDeleteClassify();

  const [isShowModalAdd, setIsShowModalAdd] = useState(false);
  const [nameTag, setNameTag] = useState('');
  const [color, setColor] = useState<any>({});
  const [isShowError, setIsShowError] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  useEffect(() => {
    if (colors.length > 0) {
      setColor(colors[0]);
    }
  }, [colors]);

  const handleCancel = () => {
    onCancel?.();
  };

  const handleCancelModalAdd = () => {
    setIsShowModalAdd(false);
  };

  const handleShowModalAdd = () => {
    setIsShowModalAdd(true);
    setIsModalEdit(false);
    setNameTag('');
    onCancel?.();
  };

  const handleBackModal = () => {
    setIsShowModalAdd(false);
    setIsModalEdit(false);
    onOpen?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const index = classifies.findIndex(
      (ele: any) => ele.name.toLowerCase() === value.toLowerCase(),
    );

    if (index >= 0) {
      if (!isModalEdit) {
        setIsShowError(true);
      } else {
        if (
          previousName.current.name.toLowerCase() !==
          classifies[index].name.toLowerCase()
        ) {
          setIsShowError(true);
        }
      }
    } else {
      setIsShowError(false);
    }
    setNameTag(value);
  };

  const handleClickColor = (selectedColor: any) => {
    setColor(selectedColor);
  };

  const handleCreateClassify = async () => {
    if (isModalEdit) {
      try {
        await updateClassify({
          classifyId: previousName.current._id,
          data: { name: nameTag, colorId: color._id },
        });
        toast.success('Cập nhật thành công');
        setIsShowModalAdd(false);
        queryClient.invalidateQueries({
          queryKey: createQueryKey('classifies', {}),
        });
        onOpen?.();
      } catch (error) {
        toast.error('Cập nhật thất bại');
      }
    } else {
      try {
        await addClassify({ name: nameTag, colorId: color._id });
        toast.success('Thêm thành công');
        setIsShowModalAdd(false);
        queryClient.invalidateQueries({
          queryKey: createQueryKey('classifies', {}),
        });
      } catch (error) {
        toast.error('Thêm thất bại');
      }
    }
    setIsModalEdit(false);
  };

  const handleEditClasify = (value: any) => {
    setIsModalEdit(true);
    setIsShowModalAdd(true);
    onCancel?.();
    setNameTag(value.name);
    setColor(value.color);
    previousName.current = value;
  };

  const handleDeleteClasify = async (value: any) => {
    try {
      await deleteClassify(value._id);
      toast.success('Xóa thành công');
      queryClient.invalidateQueries({
        queryKey: createQueryKey('classifies', {}),
      });
    } catch (error) {
      toast.error('Xóa thất bại');
    }
    setDeleteConfirm(null);
  };

  const isSubmitDisabled =
    nameTag.trim().length === 0 ||
    isShowError ||
    !(
      previousName.current?.name !== nameTag ||
      previousName.current?.color._id !== color?._id
    );

  return (
    <>
      <Dialog open={isVisible} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Quản lý thẻ phân loại
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {classifies.map((ele: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Tag
                    className="h-4 w-4"
                    style={{ color: ele.color.code }}
                  />
                  <span className="text-sm font-medium">{ele.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditClasify(ele)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteConfirm(ele)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              className="w-full mt-4 rounded-md"
              onClick={handleShowModalAdd}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm phân loại
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isShowModalAdd} onOpenChange={(open) => !open && handleCancelModalAdd()}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBackModal}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <DialogTitle>
                {isModalEdit ? 'Chi tiết thẻ phân loại' : 'Thêm thẻ phân loại'}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tên thẻ phân loại</label>
              <div className="flex gap-2">
                <Input
                  value={nameTag}
                  placeholder="Nhập tên thẻ phân loại"
                  onChange={handleInputChange}
                  className="flex-1 rounded-xmdl"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Tag className="h-4 w-4" style={{ color: color?.code }} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <p className="text-sm font-medium mb-2">Thay đổi màu thẻ</p>
                    <div className="flex flex-wrap gap-2">
                      {colors.length > 0 &&
                        colors.map((ele: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => handleClickColor(ele)}
                            className="h-6 w-6 rounded-full border-2 border-transparent hover:border-foreground/20 transition-colors"
                            style={{ background: ele.code }}
                          />
                        ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {isShowError && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Tên phân loại đã tồn tại
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelModalAdd} className="rounded-md">
              Hủy
            </Button>
            <Button onClick={handleCreateClassify} disabled={isSubmitDisabled} className="rounded-md">
              {isModalEdit ? 'Cập nhật' : 'Thêm phân loại'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cảnh báo</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có thực sự muốn xóa thẻ phân loại này?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteClasify(deleteConfirm)}>
              Đồng ý
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ModalClassify;
