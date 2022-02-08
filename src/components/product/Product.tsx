import React, { useState, useEffect, useContext } from "react";
import {
  Stack,
  HStack,
  Image,
  Text,
  Heading,
  Avatar,
  Tag,
  Divider,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Link, useHistory, useLocation } from "react-router-dom";
import moment from "moment";
import {
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

import {
  TagIcon,
  LinkLike,
  MarkdownForm,
  EditDeleteButton,
  MarkdownPreview,
} from "../index";
import {
  fetchProduct,
  fetchUserInfo,
  fetchFeedback,
  postFeedbacks,
  countLikeProduct,
  deleteProduct,
} from "../../firebase/firestore";
import { AuthContext } from "../../auth/AuthProvider";

type FeedbackDataType = {
  sumLike: number;
  feedbackText: string;
  userUid: string;
  postDate: string;
  productId: string;
};

type FeedbackType = {
  sumLike: number;
  feedbackText: string;
  userUid: string;
  postDate: string;
  productId: string;
  userIcon: string;
  userName: string;
};

const Product = (): JSX.Element => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [mainText, setMainText] = useState("");
  const [postDate, setPostDate] = useState("");
  const [editDate, setEditDate] = useState("");
  const [sumLike, setSumLike] = useState(0);
  const [userUid, setUserUid] = useState("");
  const [userIcon, setUserIcon] = useState("");
  const [userName, setUserName] = useState("");
  const [isLike, setIsLike] = useState(false);
  const [productId, setProductId] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);

  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const location = useLocation();

  /**
   * いいねボタンをクリックした際の動作を行う関数
   */
  const handleClickLikeButton: React.MouseEventHandler<HTMLButtonElement> =
    () => {
      setIsLike((prev) => {
        let condition = "UP";
        if (prev) {
          condition = "DOWN";
        } else {
          condition = "UP";
        }
        if (currentUser) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const tmp = countLikeProduct(
            productId,
            condition,
            currentUser?.uid
          ).then((newSumLike) => {
            if (typeof newSumLike === "number") {
              setSumLike(newSumLike);
            }
          });
        }
        return !prev;
      });
    };

  /**
   * マークダウンの入力の変更に合わせてfeedbackTextを変更
   * @param event マークダウンの入力イベント
   */
  const handleFeedbackText: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setFeedbackText(event.target.value);
  };

  /**
   * 投稿ボタンを押した際にFirestoreに登録して際読み込みする関数
   */
  const handlePost: React.MouseEventHandler<HTMLButtonElement> = async () => {
    // const canPost = validate();
    // if (currentUser != null && canPost) {
    if (currentUser !== null && feedbackText) {
      const feedbackId = await postFeedbacks(
        currentUser.uid,
        feedbackText,
        productId
      );
      if (feedbackId) {
        setFeedbackText("");
        history.go(0);
      } else {
        // eslint-disable-next-line no-alert
        alert("投稿処理に失敗しました");
      }
    }
  };

  const handleClickEdit: React.MouseEventHandler<HTMLButtonElement> = () => {
    history.push("/post", { productId });
  };

  const handleClickDelete: React.MouseEventHandler<HTMLButtonElement> = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tmp = deleteProduct(productId);
    history.push("/");
  };

  // 初回読み込み時にlocationからproductIdのstateを取得する
  useEffect(() => {
    setProductId((location.state as { productId: string }).productId);
  }, [location.state]);

  // productId読み込み後の各stateの初期化
  useEffect(() => {
    if (productId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tmpProductData = fetchProduct(productId).then((productData) => {
        if (productData) {
          const postDateISO = new Date(productData.postDate).toISOString();
          const editDateISO = new Date(productData.editDate).toISOString();
          const formatedPostDate = moment(postDateISO).format("YYYY年MM月DD日");
          const formatedEditDate = moment(editDateISO).format("YYYY年MM月DD日");
          setTitle(productData.productTitle);
          setAbstract(productData.productAbstract);
          setIconUrl(productData.productIconUrl);
          setGithubUrl(productData.githubUrl);
          setProductUrl(productData.productUrl);
          setTags(productData.tags);
          setMainText(productData.mainText);
          setPostDate(formatedPostDate);
          setEditDate(formatedEditDate);
          setSumLike(productData.sumLike);
          setUserUid(productData.userUid);
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tmpFeedback = fetchFeedback(productId).then((feedbackSnapshot) => {
        if (feedbackSnapshot) {
          (feedbackSnapshot as QuerySnapshot<DocumentData>).forEach(
            (feedbackDoc: QueryDocumentSnapshot<DocumentData>) => {
              const feedbackData = feedbackDoc.data() as FeedbackDataType;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const tmpUserInfo = fetchUserInfo(feedbackData.userUid).then(
                (userInfo) => {
                  if (userInfo) {
                    const newFeedback = feedbackData as FeedbackType;
                    newFeedback.userIcon = userInfo.userIcon as string;
                    newFeedback.userName = userInfo.name as string;
                    setFeedbacks((prev) =>
                      [...prev, newFeedback].sort((a, b) => {
                        if (
                          moment(a.postDate).format("YYYYMMDDHHmmss") <
                          moment(b.postDate).format("YYYYMMDDHHmmss")
                        ) {
                          return -1;
                        }
                        return 1;
                      })
                    );
                  }
                }
              );
            }
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // userUid読み込み後のユーザー情報に関するstateの初期化
  useEffect(() => {
    // 初回読み込み時にuserUidがなくエラーになるためifが必要
    if (userUid && productId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tmpUserInfo = fetchUserInfo(userUid).then((userInfo) => {
        if (userInfo) {
          setUserIcon(userInfo.userIcon);
          setUserName(userInfo.name);
        }
      });
    }
  }, [productId, userUid]);

  // ログイン中のユーザーが作品にいいねしているかを判断
  useEffect(() => {
    if (currentUser && productId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tmpUserInfo = fetchUserInfo(currentUser.uid).then((userInfo) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        if (userInfo && [...userInfo.giveLike].includes(productId)) {
          setIsLike(true);
        }
      });
    }
  }, [currentUser, productId]);

  return (
    <>
      <Stack spacing={{ base: "4", md: "2" }} pt={{ base: "4", sm: "8" }}>
        {currentUser?.uid === userUid && (
          <EditDeleteButton
            handleClickDelete={handleClickDelete}
            handleClickEdit={handleClickEdit}
          />
        )}
        <HStack spacing={{ base: "2", sm: "4", md: "6" }} align="flex-start">
          <Stack w={{ base: "30%", sm: "25%", md: "20%" }}>
            <Image w="100%" fit="cover" src={iconUrl} />
          </Stack>
          {/* 作品タイトルと概要 */}
          <Stack
            pt={{ base: "2", sm: "4", md: "6" }}
            w={{ base: "70%", sm: "75%", md: "80%" }}
            spacing={{ base: "4", sm: "8", md: "12" }}
          >
            <Heading fontSize={{ base: "lg", sm: "xl", md: "2xl" }}>
              {title}
            </Heading>
            <Text fontSize={{ base: "sm", md: "md" }}>{abstract}</Text>
          </Stack>
        </HStack>
        {/* ユーザー名・公開日表示 */}
        <Stack
          flexDir={{ base: "column", sm: "row" }}
          justify={{ base: "flex-start", sm: "center" }}
        >
          <HStack
            as={Link}
            w="20%"
            minW="115px"
            justify={{ base: "flex-start", sm: "center" }}
            to={{ pathname: "/user", state: { userUid } }}
          >
            <Avatar name={userName} src={userIcon} size="sm" />
            <Text>{userName}</Text>
          </HStack>
          <Text
            w="80%"
            pl={{ base: "0", sm: "6" }}
            fontSize={{ base: "xs", md: "sm" }}
          >
            投稿日{postDate}
            {postDate !== editDate && ` 編集日${editDate}`}
          </Text>
        </Stack>
        {/* タグ表示 */}
        <Stack flexDir={{ base: "column", md: "row" }} pl="2">
          {tags[0] !== "" && (
            <>
              <TagIcon pt={{ base: "0", md: "2" }} minW="80px" />
              <Wrap>
                {tags.map((tag, i) => (
                  <WrapItem key={i.toString()}>
                    <Tag
                      rounded="full"
                      py="2"
                      px="4"
                      fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    >
                      {tag}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </>
          )}
        </Stack>
        <Divider pt="4" />
        {/* リンク、いいね、本文を表示 */}
        <LinkLike
          githubUrl={githubUrl}
          productUrl={productUrl}
          sumLike={sumLike}
          isLike={isLike}
          handleClickLikeButton={handleClickLikeButton}
        />
        <MarkdownPreview text={mainText} isFeedback />
        <Divider pt="4" />
        <Heading size="md">フィードバック</Heading>
        {/* フィードバックの表示 */}
        {/* eslint-disable-next-line array-callback-return */}
        <Stack spacing="6">
          {feedbacks.map((feedback, i) => (
            <HStack key={i.toString()} align="flex-start" spacing="4">
              <Avatar
                as={Link}
                to={{ pathname: "/user", state: { userUid: feedback.userUid } }}
                w={{ base: "8", md: "10" }}
                h={{ base: "8", md: "10" }}
                src={feedback.userIcon}
                name={feedback.userName}
              />
              <Stack>
                <HStack spacing="4">
                  <Text fontSize={{ base: "xs", md: "sm" }}>
                    {feedback.userName}
                  </Text>
                  <Text fontSize={{ base: "xs", md: "sm" }}>
                    {moment(feedback.postDate).format("YYYY年MM月DD日")}
                    {/* {console.log(feedback.postDate)} */}
                  </Text>
                </HStack>
                <MarkdownPreview text={feedback.feedbackText} isFeedback />
              </Stack>
            </HStack>
          ))}
        </Stack>
        {/* フィードバックの入力 */}
        <MarkdownForm
          pageType="product"
          text={feedbackText}
          validText={false}
          handleText={handleFeedbackText}
          handlePost={handlePost}
          setText={setFeedbackText}
        />
      </Stack>
    </>
  );
};

export default Product;
