"use strict";(self.webpackChunk_yudiel_react_qr_scanner=self.webpackChunk_yudiel_react_qr_scanner||[]).push([[987],{"./stories/Scanner.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Scanner:()=>Scanner,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Scanner_stories});var react=__webpack_require__("./node_modules/@storybook/addon-docs/node_modules/react/index.js"),external_STORYBOOK_MODULE_PREVIEW_API_=__webpack_require__("storybook/internal/preview-api"),external_STORYBOOK_MODULE_CORE_EVENTS_PREVIEW_ERRORS_=__webpack_require__("storybook/internal/preview-errors"),external_STORYBOOK_MODULE_GLOBAL_=__webpack_require__("@storybook/global"),v4=__webpack_require__("./node_modules/uuid/dist/esm-browser/v4.js"),__defProp=Object.defineProperty,ADDON_ID="storybook/actions",EVENT_ID=`${ADDON_ID}/action-event`,config={depth:10,clearOnStoryChange:!0,limit:50},findProto=(obj,callback)=>{let proto=Object.getPrototypeOf(obj);return!proto||callback(proto)?proto:findProto(proto,callback)},serializeArg=a=>{if("object"==typeof(e=a)&&e&&findProto(e,(proto=>/^Synthetic(?:Base)?Event$/.test(proto.constructor.name)))&&"function"==typeof e.persist){let e=Object.create(a.constructor.prototype,Object.getOwnPropertyDescriptors(a));e.persist();let viewDescriptor=Object.getOwnPropertyDescriptor(e,"view"),view=viewDescriptor?.value;return"object"==typeof view&&"Window"===view?.constructor.name&&Object.defineProperty(e,"view",{...viewDescriptor,value:Object.create(view.constructor.prototype)}),e}var e;return a},generateId=()=>"object"==typeof crypto&&"function"==typeof crypto.getRandomValues?(0,v4.A)():Date.now().toString(36)+Math.random().toString(36).substring(2);function action(name,options={}){let actionOptions={...config,...options},handler=function(...args){if(options.implicit){let storyRenderer=("__STORYBOOK_PREVIEW__"in external_STORYBOOK_MODULE_GLOBAL_.global?external_STORYBOOK_MODULE_GLOBAL_.global.__STORYBOOK_PREVIEW__:void 0)?.storyRenders.find((render=>"playing"===render.phase||"rendering"===render.phase));if(storyRenderer){let deprecated=!globalThis?.FEATURES?.disallowImplicitActionsInRenderV8,error=new external_STORYBOOK_MODULE_CORE_EVENTS_PREVIEW_ERRORS_.ImplicitActionsDuringRendering({phase:storyRenderer.phase,name,deprecated});if(!deprecated)throw error;console.warn(error)}}let channel=external_STORYBOOK_MODULE_PREVIEW_API_.addons.getChannel(),id=generateId(),serializedArgs=args.map(serializeArg),normalizedArgs=args.length>1?serializedArgs:serializedArgs[0],actionDisplayToEmit={id,count:0,data:{name,args:normalizedArgs},options:{...actionOptions,maxDepth:5+(actionOptions.depth||3),allowFunction:actionOptions.allowFunction||!1}};channel.emit(EVENT_ID,actionDisplayToEmit)};return handler.isAction=!0,handler.implicit=options.implicit,handler}var preview_exports={};((target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0})})(preview_exports,{argsEnhancers:()=>argsEnhancers,loaders:()=>loaders});var isInInitialArgs=(name,initialArgs)=>typeof initialArgs[name]>"u"&&!(name in initialArgs),argsEnhancers=[context=>{let{initialArgs,argTypes,parameters:{actions:actions2}}=context;return actions2?.disable||!argTypes?{}:Object.entries(argTypes).filter((([name,argType])=>!!argType.action)).reduce(((acc,[name,argType])=>(isInInitialArgs(name,initialArgs)&&(acc[name]=action("string"==typeof argType.action?argType.action:name)),acc)),{})},context=>{let{initialArgs,argTypes,id,parameters:{actions:actions2}}=context;if(!actions2||actions2.disable||!actions2.argTypesRegex||!argTypes)return{};let argTypesRegex=new RegExp(actions2.argTypesRegex);return Object.entries(argTypes).filter((([name])=>!!argTypesRegex.test(name))).reduce(((acc,[name,argType])=>(isInInitialArgs(name,initialArgs)&&(acc[name]=action(name,{implicit:!0,id})),acc)),{})}],subscribed=!1,loaders=[context=>{let{parameters:{actions:actions2}}=context;if(!actions2?.disable&&!subscribed&&"__STORYBOOK_TEST_ON_MOCK_CALL__"in external_STORYBOOK_MODULE_GLOBAL_.global&&"function"==typeof external_STORYBOOK_MODULE_GLOBAL_.global.__STORYBOOK_TEST_ON_MOCK_CALL__){(0,external_STORYBOOK_MODULE_GLOBAL_.global.__STORYBOOK_TEST_ON_MOCK_CALL__)(((mock,args)=>{let name=mock.getMockName();"spy"!==name&&(!/^next\/.*::/.test(name)||["next/router::useRouter()","next/navigation::useRouter()","next/navigation::redirect","next/cache::","next/headers::cookies().set","next/headers::cookies().delete","next/headers::headers().set","next/headers::headers().delete"].some((prefix=>name.startsWith(prefix))))&&action(name)(args)})),subscribed=!0}}],src=__webpack_require__("./src/index.ts");const styles={container:{width:400,margin:"auto"},controls:{marginBottom:8}};const Scanner=function Template(args){const[deviceId,setDeviceId]=(0,react.useState)(void 0),[tracker,setTracker]=(0,react.useState)("centerText"),[pause,setPause]=(0,react.useState)(!1),devices=(0,src.tR)();return react.createElement("div",{style:styles.container},react.createElement("button",{style:{marginBottom:5},onClick:()=>setPause((val=>!val))},pause?"Pause Off":"Pause On"),react.createElement("div",{style:styles.controls},react.createElement("select",{onChange:e=>setDeviceId(e.target.value)},react.createElement("option",{value:void 0},"Select a device"),devices.map(((device,index)=>react.createElement("option",{key:index,value:device.deviceId},device.label)))),react.createElement("select",{style:{marginLeft:5},onChange:e=>setTracker(e.target.value)},react.createElement("option",{value:"centerText"},"Center Text"),react.createElement("option",{value:"outline"},"Outline"),react.createElement("option",{value:"boundingBox"},"Bounding Box"),react.createElement("option",{value:void 0},"No Tracker"))),react.createElement(src.Lp,{...args,formats:["qr_code","micro_qr_code","rm_qr_code","maxi_code","pdf417","aztec","data_matrix","matrix_codes","dx_film_edge","databar","databar_expanded","codabar","code_39","code_93","code_128","ean_8","ean_13","itf","linear_codes","upc_a","upc_e"],constraints:{deviceId},onScan:detectedCodes=>{action("onScan")(detectedCodes)},onError:error=>{console.log(`onError: ${error}'`)},components:{audio:!0,onOff:!0,torch:!0,zoom:!0,finder:!0,tracker:function getTracker(){switch(tracker){case"outline":return src.rj;case"boundingBox":return src.u3;case"centerText":return src.He;default:return}}()},allowMultiple:!0,scanDelay:2e3,paused:pause}))}.bind({});Scanner.args={};const Scanner_stories={title:"Scanner"},__namedExportsOrder=["Scanner"]}}]);