import { View, Text, Image, Pressable } from "react-native";
import colors from "tailwindcss/colors";

type Props = {
  OnPress: () => void;
  title: string;
  report: string;
  image: string | null;
  time: string;
  bgColor?: string;
  titleColor?: string;
  reportColor?: string;
};

const Card = ({
  OnPress,
  title,
  report,
  image,
  time,
  bgColor,
  titleColor,
  reportColor,
}: Props) => {
  return (
    <Pressable
      className="my-2 items-center active:opacity-75"
      onPress={OnPress}
    >
      <View
        className="flex-row w-80 rounded-sm"
        style={{
          height: 120,
          backgroundColor: bgColor || colors.orange[400],
        }}
      >
        <Image
          source={image ? { uri: image } : require("../assets/icon.png")}
          className="rounded-sm"
          style={{ width: 100, height: 120 }}
        />
        <View className="p-1 w-52 truncate">
          <Text
            className="font-UnboundedBold text-lg basis-2/4"
            style={{ color: titleColor || colors.slate[800] }}
          >
            {title}
          </Text>

          <Text
            className="font-light text-slate-200 basis-2/6"
            style={{ color: reportColor || colors.slate[200] }}
          >
            {report}
          </Text>

          <Text
            className="font-thin text-slate-100"
            style={{ color: reportColor || colors.slate[200] }}
          >
            {time}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default Card;
