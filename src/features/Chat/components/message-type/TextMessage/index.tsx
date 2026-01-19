import { useEffect } from 'react';
import PropTypes from 'prop-types';
import CheckLink, {
  replaceConentWithouLink,
  replaceContentToLink,
} from '@/utils/linkHelper';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import parse from 'html-react-parser';
import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

import ReplyMessage from '../ReplyMessage';
TextMessage.propTypes = {
  content: PropTypes.string,
  dateAt: PropTypes.object,
  isVisibleTime: PropTypes.bool.isRequired,
  isSeen: PropTypes.bool,
  tags: PropTypes.array,
  replyMessage: PropTypes.object,
};

TextMessage.defaultProps = {
  dateAt: null,
  isSeen: false,
  tags: [],
  replyMessage: null,
};

function TextMessage({
  content,
  children,
  dateAt,
  isSeen,
  replyMessage,
  tags,
}) {
  const handleOnClickTag = () => {
    console.log('tag');
  };
  useEffect(() => {
    tags.forEach((tag) => {
      const temp = document.getElementById(`mtc-${tag._id}`);

      if (temp) {
        temp.onclick = handleOnClickTag;
      }
    });
  }, [tags]);

  const tranferTextToTagUser = (contentMes, tagUser) => {
    let tempContent = contentMes;

    if (tagUser.length > 0) {
      tags.forEach((ele) => {
        tempContent = tempContent.replace(
          `@${ele.name}`,
          `<span id='mtc-${ele._id}' class="text-primary font-medium cursor-pointer hover:underline">@${ele.name}</span>`,
        );
      });
    }
    return parse(tempContent);
  };

  const matchesLink = CheckLink(content);

  const renderMessageText = (contentMes) => {
    if (!matchesLink) {
      return (
        <div className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
          {tags.length > 0
            ? tranferTextToTagUser(contentMes, tags)
            : contentMes}
        </div>
      );
    } else {
      if (matchesLink.length === 1) {
        return (
          <div className="space-y-2">
            <div className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
              {tags.length > 0
                ? tranferTextToTagUser(
                    replaceConentWithouLink(contentMes, matchesLink[0]),
                    tags,
                  )
                : replaceConentWithouLink(contentMes, matchesLink[0])}
            </div>
            <LinkPreview
              url={matchesLink[0]}
              imageHeight="20vh"
              className="rounded-xl overflow-hidden border border-slate-200/60"
            />
          </div>
        );
      }

      if (matchesLink.length > 1) {
        return (
          <div className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
            {tags.length > 0
              ? tranferTextToTagUser(
                  replaceContentToLink(contentMes, matchesLink),
                  tags,
                )
              : parse(replaceContentToLink(contentMes, matchesLink))}
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-1">
      {replyMessage && Object.keys(replyMessage).length > 0 && (
        <ReplyMessage replyMessage={replyMessage} />
      )}

      {renderMessageText(content)}

      <div className="flex items-center gap-1.5 text-[11px] opacity-70 select-none">
        <span>
          {`0${dateAt.getHours()}`.slice(-2)}:
          {`0${dateAt.getMinutes()}`.slice(-2)}
        </span>
        {isSeen && (
          <span className="flex items-center gap-0.5 text-emerald-500">
            <CheckCheck className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

export default TextMessage;
