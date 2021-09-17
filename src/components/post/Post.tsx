import React, { ReactEventHandler, useState, useRef } from "react";
import {
  Input,
  Textarea,
  HStack,
  Stack,
  Image,
  Box,
  Icon,
  Button,
} from "@chakra-ui/react";
import { BsImage } from "react-icons/bs";

const Post = (): JSX.Element => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [tags, setTags] = useState("");
  const [mainText, setMainText] = useState("");

  const iconInputRef = useRef<HTMLInputElement>(null);

  /**
   * タイトルの変更に合わせてタイトルのstateを変更
   * @param event 入力が変更されたイベント
   */
  const handleTitle: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setTitle(event.target.value);
  };

  /**
   * 概要の変更に合わせて概要のstateを変更
   * @param event 入力が変更されたイベント
   */
  const handleAbstract: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setAbstract(event.target.value);
  };

  /**
   * アップロードされた画像ファイルのプレビューを表示する関数
   * @param event fileをアップロードするイベント
   */
  const handleIcon: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files == null || event.target.files[0] == null) {
      setIconUrl("");
    } else {
      const imageFile = event.target.files[0];
      const imageUrl = URL.createObjectURL(imageFile);
      setIconUrl(imageUrl);
    }
  };

  /**
   * 画像変更ボタンクリックでRefのhidden属性の画像用inputタグをクリックする関数
   */
  const onClickIconButton: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (iconInputRef.current != null) {
      iconInputRef.current.click();
    }
  };

  return (
    <Stack>
      <HStack spacing="4" pt="8" align="start">
        <Stack>
          {/* minWにしないと横が潰れる */}
          {/* 画像はstateの変数から読み込む */}
          <Image minW="200px" h="200px" bg="gray.100" src={iconUrl} />
          {/* 画像アップロード用のhidden属性を付与したinput */}
          {/* 下のButtonをクリックするとinputもクリックされる */}
          <input
            hidden
            ref={iconInputRef}
            type="file"
            accept="image/*"
            onChange={handleIcon}
          />
          {/* 上のinputの代わりの画像変更用ボタン */}
          <Button
            leftIcon={<BsImage />}
            variant="ghost"
            onClick={onClickIconButton}
          >
            変更する
          </Button>
        </Stack>
        <Stack w="100%" h="200px">
          <Input
            w="100%"
            h="40%"
            placeholder="作品タイトル"
            fontSize="xl"
            variant="flushed"
            value={title}
            onChange={handleTitle}
          />
          <Input
            w="100%"
            h="60%"
            placeholder="この作品を一言で表すと？"
            variant="flushed"
            value={abstract}
            onChange={handleAbstract}
          />
        </Stack>
      </HStack>
    </Stack>
  );
};

export default Post;
