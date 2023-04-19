import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import typefaceFont from '../static/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { Mesh } from 'three'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Matcap 
const matcaps = textureLoader.load('/textures/matcaps/4.png')

/**
 * Fonts
 */
const generalMaterial = { matcap: matcaps }
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Hicham', {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.computeBoundingBox()
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial(generalMaterial)


        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
    }
)

/**
 * Object
 */
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 10, 45)
const donutMaterial = new THREE.MeshMatcapMaterial(generalMaterial)
const donut = new THREE.Mesh(donutGeometry, donutMaterial)
for (let i = 0; i < 150; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)
    scene.add(donut)

    // Position
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    // Rotation
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    // Scale
    const scale = Math.random()
    donut.scale.set(scale, scale, scale)
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    // camera.position.x = 1
    // camera.position.y = 1
camera.position.z = 3
    // camera.lookAt(Mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
    // Cursor
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = -(event.clientX / sizes.width - 0.5)
    cursor.y = event.clientY / sizes.height - 0.5
})

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // UpdateCamera
    camera.position.x = (cursor.x * Math.PI) * 2
    camera.position.y = (cursor.y * Math.PI) * 2
    camera.rotation.x = cursor.x * 3

    // Update controls
    controls.update()

    // auto-camera
    // camera.position.z = Math.cos(elapsedTime) * Math.PI

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()