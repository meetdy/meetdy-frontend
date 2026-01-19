import './style.css';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ThumbnailMultiProps {
  participants: number;
}

const sampleImage1 = 'https://vnn-imgs-f.vgcloud.vn/2019/10/09/23/bo-qua-lum-xum-huong-ly-ra-mat-mv-moi.jpg';
const sampleImage2 = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';

function ThumbnailMulti({ participants }: ThumbnailMultiProps) {
  if (participants === 2) {
    return (
      <div className="flex items-center -space-x-2">
        <Avatar className="h-7 w-7 ring-2 ring-background">
          <AvatarImage src={sampleImage1} />
          <AvatarFallback>U1</AvatarFallback>
        </Avatar>
        <Avatar className="h-7 w-7 ring-2 ring-background">
          <AvatarImage src={sampleImage2} />
          <AvatarFallback>U2</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  if (participants === 3) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center -space-x-2">
          <Avatar className="h-7 w-7 ring-2 ring-background">
            <AvatarImage src={sampleImage1} />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar className="h-7 w-7 ring-2 ring-background">
            <AvatarImage src={sampleImage2} />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
        </div>
        <Avatar className="h-7 w-7 ring-2 ring-background -mt-1">
          <AvatarImage src={sampleImage1} />
          <AvatarFallback>U3</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-0.5">
      <Avatar className="h-7 w-7 ring-2 ring-background">
        <AvatarImage src={sampleImage1} />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="h-7 w-7 ring-2 ring-background">
        <AvatarImage src={sampleImage2} />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="h-7 w-7 ring-2 ring-background">
        <AvatarImage src={sampleImage1} />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="h-7 w-7 ring-2 ring-background bg-muted">
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                +{participants - 3}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{participants - 3} thành viên khác</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ThumbnailMulti;
