import { makeInstaller } from "@yehan-ui/utils";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import components from "./components";
import "@yehan-ui/theme/index.css";

// 添加 fontawesome 图标库
library.add(fas);
const installer = makeInstaller(components);

// 影响打包后指向，用相对路径
export * from "../components";
export default installer;
