import { useMemo } from 'react';
import parse from 'html-react-parser';
import { CheckCheck } from 'lucide-react';

import {
  checkValidUrl,
  replaceContentToLink,
} from '@/utils/url-utils';

import ReplyMessage from './ReplyMessage';

function TextMessage({
  content = '',
  children,
  dateAt,
  isSeen,
  replyMessage,
  tags = [],
}) {
  /* ---------------- TAG CLICK ---------------- */
  const handleTagClick = (tag) => {
    console.log('Clicked tag:', tag);
  };

  /* ---------------- MEMO: LINKS ---------------- */
  const matchesLink = useMemo(() => {
    return checkValidUrl(content);
  }, [content]);

  /* ---------------- TAG RENDER ---------------- */
  const renderContentWithTags = (text) => {
    if (!tags.length) return text;

    const elements = [];
    let remaining = text;

    tags.forEach((tag) => {
      const split = remaining.split(`@${tag.name}`);

      if (split.length > 1) {
        elements.push(split[0]);

        elements.push(
          <span
            key={tag._id}
            onClick={() => handleTagClick(tag)}
            className="
              text-primary font-medium cursor-pointer
              hover:underline hover:text-primary/80
              transition-colors
            "
          >
            @{tag.name}
          </span>,
        );

        remaining = split.slice(1).join(`@${tag.name}`);
      }
    });

    elements.push(remaining);

    return elements;
  };

  /* ---------------- MESSAGE RENDER ---------------- */
  const renderMessageText = () => {
    /* ---------- NO LINK ---------- */
    if (!matchesLink?.length) {
      return (
        <div
          className="
            text-[15px] leading-relaxed
            break-words whitespace-pre-wrap
          "
        >
          {renderContentWithTags(content)}
        </div>
      );
    }

    /* ---------- SINGLE LINK ---------- */
    if (matchesLink.length === 1) {
      const linkUrl = matchesLink[0];
      const textWithoutLink =
        content.replace(linkUrl, '').trim();

      return (
        <div className="space-y-2.5">
          {textWithoutLink && (
            <div
              className="
                text-[15px] leading-relaxed
                break-words whitespace-pre-wrap
              "
            >
              {renderContentWithTags(textWithoutLink)}
            </div>
          )}

          <div
            className="
              rounded-xl overflow-hidden
              border border-border/60
              bg-background/50
              hover:bg-background
              transition-colors
            "
          >
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                block p-3 text-sm
                text-primary hover:underline
                break-all
              "
            >
              {linkUrl}
            </a>
          </div>
        </div>
      );
    }

    /* ---------- MULTIPLE LINKS ---------- */
    return (
      <div
        className="
          text-[15px] leading-relaxed
          break-words whitespace-pre-wrap
        "
      >
        {parse(
          replaceContentToLink(content, matchesLink),
        )}
      </div>
    );
  };

  /* ---------------- TIME FORMAT ---------------- */
  const time = useMemo(() => {
    const h = `0${dateAt.getHours()}`.slice(-2);
    const m = `0${dateAt.getMinutes()}`.slice(-2);
    return `${h}:${m}`;
  }, [dateAt]);

  return (
    <div className="space-y-1.5 max-w-full">
      {/* Reply */}
      {replyMessage &&
        Object.keys(replyMessage).length > 0 && (
          <ReplyMessage replyMessage={replyMessage} />
        )}

      {/* Message content */}
      {renderMessageText()}

      {/* Footer */}
      <div
        className="
          flex items-center gap-1.5
          text-[11px] opacity-70
          select-none
        "
      >
        <span>{time}</span>

        {isSeen && (
          <span
            className="
              flex items-center gap-0.5
              text-emerald-500
            "
          >
            <CheckCheck className="w-4 h-4" />
          </span>
        )}
      </div>

      {children}
    </div>
  );
}

export default TextMessage;
