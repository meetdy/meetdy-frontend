import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface IGenderRadioFieldProps {
  field: {
    name: string;
    value: number;
    onChange: (e: any) => void;
  };
}

export default function GenderRadioField({ field }: IGenderRadioFieldProps) {
  const { name, value, onChange } = field;

  const handleSelect = (selected: string) => {
    onChange({
      target: {
        name,
        value: Number(selected),
      },
    });
  };

  return (
    <RadioGroup
      value={String(value)}
      onValueChange={handleSelect}
      className="flex items-center gap-5"
    >
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <RadioGroupItem value="0" id="male" />
        <span className="text-sm text-foreground">Nam</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <RadioGroupItem value="1" id="female" />
        <span className="text-sm text-foreground">Nữ</span>
      </label>
    </RadioGroup>
  );
}
