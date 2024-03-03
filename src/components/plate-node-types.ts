import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
} from '@udecode/plate-basic-marks';
import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote';
import { ELEMENT_CODE_BLOCK } from '@udecode/plate-code-block';
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@udecode/plate-heading';
import { ELEMENT_LINK } from '@udecode/plate-link';
import { ELEMENT_LI, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_IMAGE } from '@udecode/plate-media';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';

export const plateNodeTypes = {
  paragraph: ELEMENT_PARAGRAPH,
  block_quote: ELEMENT_BLOCKQUOTE,
  code_block: ELEMENT_CODE_BLOCK,
  link: ELEMENT_LINK,
  ul_list: ELEMENT_UL,
  ol_list: ELEMENT_OL,
  listItem: ELEMENT_LI,
  heading: {
    1: ELEMENT_H1,
    2: ELEMENT_H2,
    3: ELEMENT_H3,
    4: ELEMENT_H4,
    5: ELEMENT_H5,
    6: ELEMENT_H6,
  },
  emphasis_mark: MARK_ITALIC,
  strong_mark: MARK_BOLD,
  delete_mark: MARK_STRIKETHROUGH,
  inline_code_mark: MARK_CODE,
  thematic_break: 'thematic_break',
  image: ELEMENT_IMAGE,
};
