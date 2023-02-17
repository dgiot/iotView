import { OBJLoader, MTLLoader } from "three-obj-mtl-loader";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


// 加载obj,mtl文件
export function objloader(path) {
    return new Promise(resolve => {
        var mtlLoader = new MTLLoader();
        //  初始化obj
        var objLoader = new OBJLoader();
        // 加载mtl文件
        mtlLoader.load(`/static/${path}.mtl`, (mtl) => {
            // 初始化
            mtl.preload();
            // 加载贴图
            objLoader.setMaterials(mtl);
            objLoader.load(`/static/${path}.obj`, (obj) => {
                resolve({ mtl, obj })
            })
        })
    });
}

// 加载fbx文件
export function fbxloader(path) {
    return new Promise(resolve => {
        var loader = new FBXLoader();
        loader.load(`${path}`, (fbx) => {
            resolve(fbx)
        })
    });
}
// 加载gtlf文件
export function gltfloader(path) {
    return new Promise(resolve => {
        var loader = new GLTFLoader();
        loader.load(`${path}`, (gltf) => {
            resolve(gltf)
        })
    });
}
