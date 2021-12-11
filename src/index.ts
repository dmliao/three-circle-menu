import * as THREE from 'three'
import { addLoopFunction, camera, initTHREE, scene } from './three-globals'


let clock: THREE.Clock
let progressBar: CircleProgressBar;

class CircleProgressBar extends THREE.Group {
	protected backingCircle;
	protected frontCircle: THREE.CircleBufferGeometry;

	protected backMesh: THREE.Mesh;
	protected frontMesh: THREE.Mesh;

	protected radius: number;
	constructor(radius: number) {
		super()

		this.radius = radius;
		this.backingCircle = new THREE.CircleBufferGeometry(radius, 30, 0, 2 * Math.PI);
		this.frontCircle = new THREE.CircleBufferGeometry(radius, 30, 0, 2 * Math.PI);

		this.backMesh = new THREE.Mesh(this.backingCircle, new THREE.MeshBasicMaterial({
			depthWrite: false,
			color: 0xffffff
		}))
		this.frontMesh = new THREE.Mesh(this.frontCircle, new THREE.MeshBasicMaterial({
			depthWrite: false,
			color: 0x0000ff
		}))

		// this.frontMesh.position.z = 0.01;
		this.frontMesh.renderOrder = 1;

		this.add(this.backMesh)
		this.add(this.frontMesh);
	}

	public setPercentage(number: number) {
		const theta = number * 2 * Math.PI;

		this.frontMesh.geometry.dispose()
		this.frontCircle = new THREE.CircleBufferGeometry(this.radius, 30, 0, theta);
		this.frontMesh.geometry = this.frontCircle;
	}
}

const init = async () => {
	// set up three globals
	initTHREE()

	const axesHelper = new THREE.AxesHelper(5)
	scene.add(axesHelper)

	clock = new THREE.Clock()

	// custom threejs setup

	// lights
	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, 1.5, 1).multiplyScalar(50)
	light.shadow.mapSize.setScalar(2048)
	light.shadow.bias = -1e-4
	light.shadow.normalBias = 0.05
	light.castShadow = true
	scene.add(light)
	scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.4))

	// progress bar
	let percentage = 0;
	progressBar = new CircleProgressBar(0.25);
	scene.add(progressBar);

	// keyboard controls
	window.addEventListener('keydown', (e) => {
		if (e.key === "w") {
			percentage += 0.05;
			percentage = Math.min(percentage, 1)
			progressBar.setPercentage(percentage);
		}

		if (e.key === "s") {
			percentage -= 0.05;
			percentage = Math.max(percentage, 0)
			progressBar.setPercentage(percentage);
		}
	})
}

const execute = () => {
	progressBar.lookAt(camera.position)
}

addLoopFunction(execute)

window.addEventListener('load', init)