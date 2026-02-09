import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Plus, MinusCircle } from 'lucide-react';
import { toast } from 'sonner';

import voteApi from '@/api/voteApi';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ModalCreateVoteProps {
  visible?: boolean;
  onCancel?: () => void;
}

function ModalCreateVote({ visible = false, onCancel }: ModalCreateVoteProps) {
  const { currentConversation } = useSelector((state: any) => state.chatUi);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [errors, setErrors] = useState<{ question?: string; options?: string[] }>({});
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    onCancel?.();
    setQuestion('');
    setOptions(['', '']);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { question?: string; options?: string[] } = {};
    let isValid = true;

    if (!question.trim()) {
      newErrors.question = 'Đặt câu hỏi bình chọn';
      isValid = false;
    }

    const optionErrors: string[] = [];
    const optionValues: string[] = [];

    options.forEach((opt, index) => {
      if (!opt.trim()) {
        optionErrors[index] = 'Nhập thông tin lựa chọn';
        isValid = false;
      } else if (optionValues.includes(opt.toLowerCase())) {
        optionErrors[index] = 'Các lựa chọn không được trùng nhau';
        isValid = false;
      } else {
        optionValues.push(opt.toLowerCase());
      }
    });

    if (optionErrors.length > 0) {
      newErrors.options = optionErrors;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await voteApi.createVote(question, options, currentConversation);
      toast.success('Tạo cuộc bình chọn thành công');
      handleCancel();
    } catch (error) {
      toast.error('Đã có lỗi xảy ra');
    }
    setLoading(false);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo bình chọn</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Chủ đề bình chọn</Label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi bình chọn"
            />
            {errors.question && (
              <p className="text-sm text-destructive">{errors.question}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Các lựa chọn</Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Lựa chọn ${index + 1}`}
                />
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {errors.options?.map((error, index) =>
              error ? (
                <p key={index} className="text-sm text-destructive">
                  Lựa chọn {index + 1}: {error}
                </p>
              ) : null,
            )}
          </div>

          <Button variant="outline" onClick={addOption} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Thêm lựa chọn
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? 'Đang tạo...' : 'Tạo bình chọn'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalCreateVote;
