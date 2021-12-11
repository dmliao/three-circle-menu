import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

export let scene: THREE.Scene = new THREE.Scene()
export let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
	60,
	WIDTH / HEIGHT,
	0.1,
	1000
)
export let renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
	antialias: true,
})

export let controls: OrbitControls
export let cameraGroup = new THREE.Group()

const loopFunctions = []

export const initTHREE = () => {
	scene.background = new THREE.Color(0x505050)

	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(WIDTH, HEIGHT)
	renderer.xr.enabled = true
	document.body.appendChild(VRButton.createButton(renderer))
	document.body.appendChild(renderer.domElement)

	camera.position.set(0, 1.6, 5)
	cameraGroup.add(camera)
	scene.add(cameraGroup)

	renderer.setAnimationLoop(loop)

	window.addEventListener('resize', onWindowResize)

	controls = new OrbitControls(camera, renderer.domElement)

	return { scene, camera, renderer }
}

export const addLoopFunction = (f) => {
	loopFunctions.push(f)
}

const loop = () => {
	for (let f of loopFunctions) {
		f()
	}

	// the render needs to be the last thing that happens, after we have
	// performed every other calculation
	renderer.render(scene, camera)
}

const onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
}
