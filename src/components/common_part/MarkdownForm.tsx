import React from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Textarea,
  Stack,
  HStack,
  Button,
  Icon,
  FormControl,
  FormHelperText,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChackUIRenderer from "chakra-ui-markdown-renderer";
import { BsImage } from "react-icons/bs";
import { AiFillGithub } from "react-icons/ai";

type MarkdownFormProps = {
  pageType: "post" | "product";
  text: string;
  validText: boolean;
  handleText: React.ChangeEventHandler<HTMLTextAreaElement>;
  handlePost: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * マークダウンの入力フォームのコンポーネントの関数
 * @param props.pygeType post：作品投稿ページ、product：作品詳細ページのレビュー投稿用
 * @param props.mainText 作品の説明の本文
 * @param props.handleMainText 説明の変更に合わせて実行する関数
 * @param props.handlePost 投稿ボタンを押した際の処理をする関数
 * @returns Markdownのコンポーネント
 */
const MarkdownForm = (props: MarkdownFormProps): JSX.Element => (
  <Stack pb="8">
    <Tabs variant="unstyled">
      <Stack
        flexDir={{ base: "column-reverse", sm: "row" }}
        justify="space-between"
      >
        <TabList pt="2">
          <Tab
            rounded="full"
            fontSize={{ base: "sm", md: "md" }}
            _selected={{ color: "#FCFCFC", bg: "#99CED4" }}
          >
            マークダウン
          </Tab>
          <Tab
            rounded="full"
            fontSize={{ base: "sm", md: "md" }}
            _selected={{ color: "#FCFCFC", bg: "#99CED4" }}
          >
            プレビュー
          </Tab>
        </TabList>
        {props.pageType === "post" && (
          <Button variant="outline" w="max-content">
            <Icon
              as={AiFillGithub}
              h="10"
              w="10"
              pr="2"
              fontSize={{ base: "sm", md: "md" }}
            />
            GitHubから読み込む
          </Button>
        )}
      </Stack>
      <TabPanels>
        <TabPanel p="0" pt="4">
          <FormControl>
            <Textarea
              value={props.text}
              onChange={props.handleText}
              placeholder="マークダウン形式で入力"
              bg="#FCFCFC"
              shadow="inner"
              minH="72"
              p="4"
            />
            {props.validText && (
              <FormHelperText color="red">
                説明を入力してください。
              </FormHelperText>
            )}
          </FormControl>
        </TabPanel>
        <TabPanel p="0" pt="4">
          <Text
            as={ReactMarkdown}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            components={ChackUIRenderer()}
            remarkPlugins={[remarkGfm]}
            bg="#FCFCFC"
            border="1px"
            borderColor="gray.200"
            rounded="md"
            minH="72"
            p="4"
          >
            {props.text}
          </Text>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <HStack justify="space-between">
      {/* 下のinputの代わりの画像変更用ボタン */}
      <Button
        leftIcon={<BsImage />}
        variant="ghost"
        // onClick={}
      >
        {/* 上のButtonをクリックするとinputもクリックされる */}
        <input
          hidden
          // ref={}
          type="file"
          accept="image/*"
          // onChange={}
        />
        画像を追加
      </Button>
      <Button variant="outline" onClick={props.handlePost}>
        {props.pageType === "post" && "作品を投稿する"}
        {props.pageType === "product" && "フィードバックを投稿する"}
      </Button>
    </HStack>
  </Stack>
);

export default MarkdownForm;
