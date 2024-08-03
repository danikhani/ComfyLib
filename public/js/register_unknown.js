import { ComfyUI, $el } from "./comfy/ui.js";
//import { ComfyAppMenu } from "./ui/menu/index.js";
import { ComfyWidgets, initWidgets } from "./comfy/widgets.js";
export const ANIM_PREVIEW_WIDGET = "$$comfy_animation_preview";
import { getPngMetadata, getWebpMetadata, getFlacMetadata, getLatentMetadata } from "./comfy/pnginfo.js";

/**
 * @typedef {import("types/comfy").ComfyExtension} ComfyExtension
 */


function sanitizeNodeName(string) {
	let entityMap = {
		'&': '',
		'<': '',
		'>': '',
		'"': '',
		"'": '',
		'`': '',
		'=': ''
	};
	return String(string).replace(/[&<>"'`=]/g, function fromEntityMap(s) {
		return entityMap[s];
	});
}

export class ComfyApp {




	constructor() {
		// this.ui = new ComfyUI(this);
		// this.logging = new ComfyLogging(this);
		// this.workflowManager = new ComfyWorkflowManager(this);
		this.bodyTop = $el("div.comfyui-body-top", { parent: document.body });
		this.bodyLeft = $el("div.comfyui-body-left", { parent: document.body });
		this.bodyRight = $el("div.comfyui-body-right", { parent: document.body });
		this.bodyBottom = $el("div.comfyui-body-bottom", { parent: document.body });
		//this.menu = new ComfyAppMenu(this);

		/**
		 * List of extensions that are registered with the app
		 * @type {ComfyExtension[]}
		 */
		this.extensions = [];

		/**
		 * Stores the execution output data for each node
		 * @type {Record<string, any>}
		 */
		this._nodeOutputs = {};

		/**
		 * Stores the preview image data for each node
		 * @type {Record<string, Image>}
		 */
		this.nodePreviewImages = {};

		/**
		 * If the shift key on the keyboard is pressed
		 * @type {boolean}
		 */
		this.shiftDown = false;

		this.registeredNodes = {};
	}

	get nodeOutputs() {
		return this._nodeOutputs;
	}

	set nodeOutputs(value) {
		this._nodeOutputs = value;
		this.#invokeExtensions("onNodeOutputsUpdated", value);
	}


	importGraph(graph, json) {
		const data = JSON.parse(json);
		graph.clear(); // Clear the current graph
		graph.configure(data); // Load the new graph
	}

	/**
	 * Registers nodes with the graph
	 */
	async registerNodes() {
		// Load node definitions from the backend
		//const defs = await api.getNodeDefs();

		const defs = {
			"comfy-1": {
				"name": "comfy-node",
				"display_name": "Comfy Node",
				"category": "Comfy",
				"input": {
					"required": {
						"input": ["number", { "forceInput": true }]
					},
					"optional": {
						"optionalInput": ["number", { "defaultInput": 0 }]
					}
				},
				"output": ["number"],
				"output_name": ["output"],
				"output_is_list": [false]
			}
		}
		const def2 = {
			"ImpactKSamplerBasicPipe": {
				"name": "comfy-node",
				"display_name": "Comfy Node",
				"category": "Comfy",
				"input": {
					"required": {
						"input": ["number", { "forceInput": true }]
					},
					"optional": {
						"optionalInput": ["number", { "defaultInput": 0 }]
					}
				},
				"output": ["number"],
				"output_name": ["output"],
				"output_is_list": [false]
			},
			"customnode1": {
				"name": "comfy-node2",
				"display_name": "Comfy Node",
				"category": "Comfy",
				"input": {
					"required": {
						"input": ["number", { "forceInput": true }]
					},
					"optional": {
						"optionalInput": ["number", { "defaultInput": 0 }]
					}
				},
				"output": ["number"],
				"output_name": ["output"],
				"output_is_list": [false]
			},
			"test2": {
				"input": {
					"required": {
						"config_name": [
							[
								"anything_v3.yaml",
								"v1-inference.yaml",
								"v1-inference_clip_skip_2.yaml",
								"v1-inference_clip_skip_2_fp16.yaml",
								"v1-inference_fp16.yaml",
								"v1-inpainting-inference.yaml",
								"v2-inference-v.yaml",
								"v2-inference-v_fp32.yaml",
								"v2-inference.yaml",
								"v2-inference_fp32.yaml",
								"v2-inpainting-inference.yaml"
							]
						],
						"ckpt_name": [
							[
								"15\\cyberrealistic_v41BackToBasics.safetensors",
								"15\\dreamshaper_8.safetensors",
								"15\\epicrealism_naturalSinRC1VAE.safetensors",
								"15\\photon_v1.safetensors",
								"15\\picxReal_10.safetensors",
								"15\\realisticVisionV60B1_v60B1VAE.safetensors",
								"15\\v1-5-pruned-emaonly.ckpt",
								"15\\v1-5-pruned-emaonly.safetensors",
								"15\\v1-5-pruned.ckpt",
								"last.safetensors",
								"xl\\RealVisXL_V3.0_Turbo.safetensors",
								"xl\\dreamshaperXL_turboDpmppSDE.safetensors",
								"xl\\juggernautXL_v9Rdphoto2Lightning.safetensors",
								"xl\\protovisionXLHighFidelity3D_releaseV660Bakedvae.safetensors",
								"xl\\realisticVisionV60B1_v51HyperVAE.safetensors",
								"xl\\realvisxlV30Turbo_v30TurboBakedvae.safetensors",
								"xl\\realvisxlV40_v40Bakedvae_2.safetensors",
								"xl\\realvisxlV40_v40LightningBakedvae.safetensors",
								"xl\\refiner\\sd_xl_refiner_1.0.safetensors",
								"xl\\sdXL_v10VAEFix.safetensors",
								"xl\\sd_xl_base_1.0.safetensors",
								"xl\\sd_xl_base_1.0_0.9vae.safetensors"
							]
						]
					},
					"optional": {
						"optionalInput": ["number", { "defaultInput": 0 }]
					}
				},
				"output": [
					"MODEL",
					"CLIP",
					"VAE"
				],
				"output_is_list": [
					false,
					false,
					false
				],
				"output_name": [
					"MODEL",
					"CLIP",
					"VAE"
				],
				"name": "CheckpointLoader",
				"display_name": "Load Checkpoint With Config (DEPRECATED)",
				"description": "",
				"category": "advanced/loaders",
				"output_node": false
			}
		}


		await this.registerNodesFromDefs(def2);
		await this.#invokeExtensionsAsync("registerCustomNodes");
	}

	registerSingleUnknownNode(node) {

		// widgets go here
		const list_of_widgets = {};
		if (node.widgets_values != undefined) {
			node.widgets_values.forEach((widget, i) => {
				// if(widget == null) continue
				if (widget != null && widget.length > 100) {
					list_of_widgets["text"] = [
						"STRING",
						{
							"multiline": true,
							"dynamicPrompts": true
						}]
				}
				else {
					//console.log(widget);
					list_of_widgets["unknown widget " + i] = [[]];
				}
			});
		}

		//inputs
		if (node.inputs != undefined) {
			node.inputs.forEach((input_i, i) => {
				list_of_widgets[input_i.name] = [input_i.type];
			});
		}

		// outputs go here
		const output = [];
		const output_is_list = [];
		const output_name = [];
		if (node.outputs != undefined) {
			node.outputs.forEach((output_i, i) => {
				output.push(output_i.type);
				output_is_list.push(false);
				output_name.push(output_i.name);
			});
		}
		// widget name
		let node_name = node.type;
		if (node.properties["Node name for S&R"] != undefined) {
			node_name = node.properties["Node name for S&R"];
		}

		//const list_of_all_input = list_of_widgets.concat(input_list)

		const node_dict = {
			"input": {
				"required": list_of_widgets
			},
			"output": output,
			"output_is_list": output_is_list,
			"output_name": output_name,
			"name": node_name,
			"display_name": node_name,
			"description": "",
			"category": "unknown",
			"output_node": false
		}

		return node_dict;


	}

	async getDefsFromImportedJson(json) {
		const data = JSON.parse(json);
		const nodes = data.nodes;
		console.log(nodes);
		const defs = {};
		for (const node of nodes) {
			if (node.type in defs) continue;

			defs[node.type] = this.registerSingleUnknownNode(node)

		}

		await this.registerNodesFromDefs(defs);
		await this.#invokeExtensionsAsync("registerCustomNodes");
	}


	async registerNodesFromDefs(defs) {
		await this.#invokeExtensionsAsync("addCustomNodeDefs", defs);

		// Generate list of known widgets
		this.widgets = Object.assign(
			{},
			ComfyWidgets,
			...(await this.#invokeExtensionsAsync("getCustomWidgets")).filter(Boolean)
		);

		// Register a node for each definition
		for (const nodeId in defs) {
			console.log("Registering node", nodeId);
			this.registerNodeDef(nodeId, defs[nodeId]);
		}
	}

	getWidgetType(inputData, inputName) {
		const type = inputData[0];

		if (Array.isArray(type)) {
			return "COMBO";
		} else if (`${type}:${inputName}` in this.widgets) {
			return `${type}:${inputName}`;
		} else if (type in this.widgets) {
			return type;
		} else {
			return null;
		}
	}

	async registerNodeDef(nodeId, nodeData) {
		console.log(nodeId, nodeData);
		//await registerNodeTemplate(nodeId, nodeData);
		//nodeId = "test2";
		const self = this;
		const node = Object.assign(
			function ComfyNode() {
				var inputs = nodeData["input"]["required"];
				if (nodeData["input"]["optional"] != undefined) {
					inputs = Object.assign({}, nodeData["input"]["required"], nodeData["input"]["optional"]);
				}
				const config = { minWidth: 1, minHeight: 1 };
				for (const inputName in inputs) {
					const inputData = inputs[inputName];
					const type = inputData[0];

					let widgetCreated = true;
					const widgetType = self.getWidgetType(inputData, inputName);
					if (widgetType) {
						if (widgetType === "COMBO") {
							Object.assign(config, self.widgets.COMBO(this, inputName, inputData, app) || {});
						} else {
							Object.assign(config, self.widgets[widgetType](this, inputName, inputData, app) || {});
						}
					} else {
						// Node connection inputs
						this.addInput(inputName, type);
						widgetCreated = false;
					}

					if (widgetCreated && inputData[1]?.forceInput && config?.widget) {
						if (!config.widget.options) config.widget.options = {};
						config.widget.options.forceInput = inputData[1].forceInput;
					}
					if (widgetCreated && inputData[1]?.defaultInput && config?.widget) {
						if (!config.widget.options) config.widget.options = {};
						config.widget.options.defaultInput = inputData[1].defaultInput;
					}
				}

				for (const o in nodeData["output"]) {
					let output = nodeData["output"][o];
					if (output instanceof Array) output = "COMBO";
					const outputName = nodeData["output_name"][o] || output;
					const outputShape = nodeData["output_is_list"][o] ? LiteGraph.GRID_SHAPE : LiteGraph.CIRCLE_SHAPE;
					this.addOutput(outputName, output, { shape: outputShape });
				}

				const s = this.computeSize();
				s[0] = Math.max(config.minWidth, s[0] * 1.5);
				s[1] = Math.max(config.minHeight, s[1]);
				this.size = s;
				this.serialize_widgets = true;

				app.#invokeExtensionsAsync("nodeCreated", this);
			},
			{
				title: nodeData.display_name || nodeData.name,
				comfyClass: nodeData.name,
				nodeData
			}
		);
		node.prototype.comfyClass = nodeData.name;

		this.#addNodeContextMenuHandler(node);
		this.#addDrawBackgroundHandler(node, app);
		this.#addNodeKeyHandler(node);

		await this.#invokeExtensionsAsync("beforeRegisterNodeDef", node, nodeData);
		LiteGraph.registerNodeType(nodeId, node);
		node.realNodeId = nodeId;
		//LiteGraph.registerNodeType("customnode1", node);
		//const id2 = window.crypto.randomUUID();
		//LiteGraph.registerNodeType("ControlNetLoader", node);
		node.category = nodeData.category;
	}

	getWidgetType(inputData, inputName) {
		const type = inputData[0];

		if (Array.isArray(type)) {
			return "COMBO";
		} else if (`${type}:${inputName}` in this.widgets) {
			return `${type}:${inputName}`;
		} else if (type in this.widgets) {
			return type;
		} else {
			return null;
		}
	}

	/**
	 * Adds special context menu handling for nodes
	 * e.g. this adds Open Image functionality for nodes that show images
	 * @param {*} node The node to add the menu handler
	 */
	#addNodeContextMenuHandler(node) {
		function getCopyImageOption(img) {
			if (typeof window.ClipboardItem === "undefined") return [];
			return [
				{
					content: "Copy Image",
					callback: async () => {
						const url = new URL(img.src);
						url.searchParams.delete("preview");

						const writeImage = async (blob) => {
							await navigator.clipboard.write([
								new ClipboardItem({
									[blob.type]: blob,
								}),
							]);
						};

						try {
							const data = await fetch(url);
							const blob = await data.blob();
							try {
								await writeImage(blob);
							} catch (error) {
								// Chrome seems to only support PNG on write, convert and try again
								if (blob.type !== "image/png") {
									const canvas = $el("canvas", {
										width: img.naturalWidth,
										height: img.naturalHeight,
									});
									const ctx = canvas.getContext("2d");
									let image;
									if (typeof window.createImageBitmap === "undefined") {
										image = new Image();
										const p = new Promise((resolve, reject) => {
											image.onload = resolve;
											image.onerror = reject;
										}).finally(() => {
											URL.revokeObjectURL(image.src);
										});
										image.src = URL.createObjectURL(blob);
										await p;
									} else {
										image = await createImageBitmap(blob);
									}
									try {
										ctx.drawImage(image, 0, 0);
										canvas.toBlob(writeImage, "image/png");
									} finally {
										if (typeof image.close === "function") {
											image.close();
										}
									}

									return;
								}
								throw error;
							}
						} catch (error) {
							alert("Error copying image: " + (error.message ?? error));
						}
					},
				},
			];
		}

		node.prototype.getExtraMenuOptions = function (_, options) {
			if (this.imgs) {
				// If this node has images then we add an open in new tab item
				let img;
				if (this.imageIndex != null) {
					// An image is selected so select that
					img = this.imgs[this.imageIndex];
				} else if (this.overIndex != null) {
					// No image is selected but one is hovered
					img = this.imgs[this.overIndex];
				}
				if (img) {
					options.unshift(
						{
							content: "Open Image",
							callback: () => {
								let url = new URL(img.src);
								url.searchParams.delete("preview");
								window.open(url, "_blank");
							},
						},
						...getCopyImageOption(img),
						{
							content: "Save Image",
							callback: () => {
								const a = document.createElement("a");
								let url = new URL(img.src);
								url.searchParams.delete("preview");
								a.href = url;
								a.setAttribute("download", new URLSearchParams(url.search).get("filename"));
								document.body.append(a);
								a.click();
								requestAnimationFrame(() => a.remove());
							},
						}
					);
				}
			}

			options.push({
				content: "Bypass",
				callback: (obj) => {
					if (this.mode === 4) this.mode = 0;
					else this.mode = 4;
					this.graph.change();
				},
			});

			// prevent conflict of clipspace content
			if (!ComfyApp.clipspace_return_node) {
				options.push({
					content: "Copy (Clipspace)",
					callback: (obj) => {
						ComfyApp.copyToClipspace(this);
					},
				});

				if (ComfyApp.clipspace != null) {
					options.push({
						content: "Paste (Clipspace)",
						callback: () => {
							ComfyApp.pasteFromClipspace(this);
						},
					});
				}

				if (ComfyApp.isImageNode(this)) {
					options.push({
						content: "Open in MaskEditor",
						callback: (obj) => {
							ComfyApp.copyToClipspace(this);
							ComfyApp.clipspace_return_node = this;
							ComfyApp.open_maskeditor();
						},
					});
				}
			}
		};
	}

	#addNodeKeyHandler(node) {
		const app = this;
		const origNodeOnKeyDown = node.prototype.onKeyDown;

		node.prototype.onKeyDown = function (e) {
			if (origNodeOnKeyDown && origNodeOnKeyDown.apply(this, e) === false) {
				return false;
			}

			if (this.flags.collapsed || !this.imgs || this.imageIndex === null) {
				return;
			}

			let handled = false;

			if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
				if (e.key === "ArrowLeft") {
					this.imageIndex -= 1;
				} else if (e.key === "ArrowRight") {
					this.imageIndex += 1;
				}
				this.imageIndex %= this.imgs.length;

				if (this.imageIndex < 0) {
					this.imageIndex = this.imgs.length + this.imageIndex;
				}
				handled = true;
			} else if (e.key === "Escape") {
				this.imageIndex = null;
				handled = true;
			}

			if (handled === true) {
				e.preventDefault();
				e.stopImmediatePropagation();
				return false;
			}
		}
	}

	/**
	 * Adds Custom drawing logic for nodes
	 * e.g. Draws images and handles thumbnail navigation on nodes that output images
	 * @param {*} node The node to add the draw handler
	 */
	#addDrawBackgroundHandler(node) {
		const app = this;

		function getImageTop(node) {
			let shiftY;
			if (node.imageOffset != null) {
				shiftY = node.imageOffset;
			} else {
				if (node.widgets?.length) {
					const w = node.widgets[node.widgets.length - 1];
					shiftY = w.last_y;
					if (w.computeSize) {
						shiftY += w.computeSize()[1] + 4;
					}
					else if (w.computedHeight) {
						shiftY += w.computedHeight;
					}
					else {
						shiftY += LiteGraph.NODE_WIDGET_HEIGHT + 4;
					}
				} else {
					shiftY = node.computeSize()[1];
				}
			}
			return shiftY;
		}

		node.prototype.setSizeForImage = function (force) {
			if (!force && this.animatedImages) return;

			if (this.inputHeight || this.freeWidgetSpace > 210) {
				this.setSize(this.size);
				return;
			}
			const minHeight = getImageTop(this) + 220;
			if (this.size[1] < minHeight) {
				this.setSize([this.size[0], minHeight]);
			}
		};

		node.prototype.onDrawBackground = function (ctx) {
			if (!this.flags.collapsed) {
				let imgURLs = []
				let imagesChanged = false

				const output = app.nodeOutputs[this.id + ""];
				if (output?.images) {
					this.animatedImages = output?.animated?.find(Boolean);
					if (this.images !== output.images) {
						this.images = output.images;
						imagesChanged = true;
						imgURLs = imgURLs.concat(
							output.images.map((params) => {
								return api.apiURL(
									"/view?" +
									new URLSearchParams(params).toString() +
									(this.animatedImages ? "" : app.getPreviewFormatParam()) + app.getRandParam()
								);
							})
						);
					}
				}

				const preview = app.nodePreviewImages[this.id + ""]
				if (this.preview !== preview) {
					this.preview = preview
					imagesChanged = true;
					if (preview != null) {
						imgURLs.push(preview);
					}
				}

				if (imagesChanged) {
					this.imageIndex = null;
					if (imgURLs.length > 0) {
						Promise.all(
							imgURLs.map((src) => {
								return new Promise((r) => {
									const img = new Image();
									img.onload = () => r(img);
									img.onerror = () => r(null);
									img.src = src
								});
							})
						).then((imgs) => {
							if ((!output || this.images === output.images) && (!preview || this.preview === preview)) {
								this.imgs = imgs.filter(Boolean);
								this.setSizeForImage?.();
								app.graph.setDirtyCanvas(true);
							}
						});
					}
					else {
						this.imgs = null;
					}
				}

				function calculateGrid(w, h, n) {
					let columns, rows, cellsize;

					if (w > h) {
						cellsize = h;
						columns = Math.ceil(w / cellsize);
						rows = Math.ceil(n / columns);
					} else {
						cellsize = w;
						rows = Math.ceil(h / cellsize);
						columns = Math.ceil(n / rows);
					}

					while (columns * rows < n) {
						cellsize++;
						if (w >= h) {
							columns = Math.ceil(w / cellsize);
							rows = Math.ceil(n / columns);
						} else {
							rows = Math.ceil(h / cellsize);
							columns = Math.ceil(n / rows);
						}
					}

					const cell_size = Math.min(w / columns, h / rows);
					return { cell_size, columns, rows };
				}

				function is_all_same_aspect_ratio(imgs) {
					// assume: imgs.length >= 2
					let ratio = imgs[0].naturalWidth / imgs[0].naturalHeight;

					for (let i = 1; i < imgs.length; i++) {
						let this_ratio = imgs[i].naturalWidth / imgs[i].naturalHeight;
						if (ratio != this_ratio)
							return false;
					}

					return true;
				}

				if (this.imgs?.length) {
					const widgetIdx = this.widgets?.findIndex((w) => w.name === ANIM_PREVIEW_WIDGET);

					if (this.animatedImages) {
						// Instead of using the canvas we'll use a IMG
						if (widgetIdx > -1) {
							// Replace content
							const widget = this.widgets[widgetIdx];
							widget.options.host.updateImages(this.imgs);
						} else {
							const host = createImageHost(this);
							this.setSizeForImage(true);
							const widget = this.addDOMWidget(ANIM_PREVIEW_WIDGET, "img", host.el, {
								host,
								getHeight: host.getHeight,
								onDraw: host.onDraw,
								hideOnZoom: false
							});
							widget.serializeValue = () => undefined;
							widget.options.host.updateImages(this.imgs);
						}
						return;
					}

					if (widgetIdx > -1) {
						this.widgets[widgetIdx].onRemove?.();
						this.widgets.splice(widgetIdx, 1);
					}

					const canvas = app.graph.list_of_graphcanvas[0];
					const mouse = canvas.graph_mouse;
					if (!canvas.pointer_is_down && this.pointerDown) {
						if (mouse[0] === this.pointerDown.pos[0] && mouse[1] === this.pointerDown.pos[1]) {
							this.imageIndex = this.pointerDown.index;
						}
						this.pointerDown = null;
					}

					let imageIndex = this.imageIndex;
					const numImages = this.imgs.length;
					if (numImages === 1 && !imageIndex) {
						this.imageIndex = imageIndex = 0;
					}

					const top = getImageTop(this);
					var shiftY = top;

					let dw = this.size[0];
					let dh = this.size[1];
					dh -= shiftY;

					if (imageIndex == null) {
						var cellWidth, cellHeight, shiftX, cell_padding, cols;

						const compact_mode = is_all_same_aspect_ratio(this.imgs);
						if (!compact_mode) {
							// use rectangle cell style and border line
							cell_padding = 2;
							const { cell_size, columns, rows } = calculateGrid(dw, dh, numImages);
							cols = columns;

							cellWidth = cell_size;
							cellHeight = cell_size;
							shiftX = (dw - cell_size * cols) / 2;
							shiftY = (dh - cell_size * rows) / 2 + top;
						}
						else {
							cell_padding = 0;
							({ cellWidth, cellHeight, cols, shiftX } = calculateImageGrid(this.imgs, dw, dh));
						}

						let anyHovered = false;
						this.imageRects = [];
						for (let i = 0; i < numImages; i++) {
							const img = this.imgs[i];
							const row = Math.floor(i / cols);
							const col = i % cols;
							const x = col * cellWidth + shiftX;
							const y = row * cellHeight + shiftY;
							if (!anyHovered) {
								anyHovered = LiteGraph.isInsideRectangle(
									mouse[0],
									mouse[1],
									x + this.pos[0],
									y + this.pos[1],
									cellWidth,
									cellHeight
								);
								if (anyHovered) {
									this.overIndex = i;
									let value = 110;
									if (canvas.pointer_is_down) {
										if (!this.pointerDown || this.pointerDown.index !== i) {
											this.pointerDown = { index: i, pos: [...mouse] };
										}
										value = 125;
									}
									ctx.filter = `contrast(${value}%) brightness(${value}%)`;
									canvas.canvas.style.cursor = "pointer";
								}
							}
							this.imageRects.push([x, y, cellWidth, cellHeight]);

							let wratio = cellWidth / img.width;
							let hratio = cellHeight / img.height;
							var ratio = Math.min(wratio, hratio);

							let imgHeight = ratio * img.height;
							let imgY = row * cellHeight + shiftY + (cellHeight - imgHeight) / 2;
							let imgWidth = ratio * img.width;
							let imgX = col * cellWidth + shiftX + (cellWidth - imgWidth) / 2;

							ctx.drawImage(img, imgX + cell_padding, imgY + cell_padding, imgWidth - cell_padding * 2, imgHeight - cell_padding * 2);
							if (!compact_mode) {
								// rectangle cell and border line style
								ctx.strokeStyle = "#8F8F8F";
								ctx.lineWidth = 1;
								ctx.strokeRect(x + cell_padding, y + cell_padding, cellWidth - cell_padding * 2, cellHeight - cell_padding * 2);
							}

							ctx.filter = "none";
						}

						if (!anyHovered) {
							this.pointerDown = null;
							this.overIndex = null;
						}
					} else {
						// Draw individual
						let w = this.imgs[imageIndex].naturalWidth;
						let h = this.imgs[imageIndex].naturalHeight;

						const scaleX = dw / w;
						const scaleY = dh / h;
						const scale = Math.min(scaleX, scaleY, 1);

						w *= scale;
						h *= scale;

						let x = (dw - w) / 2;
						let y = (dh - h) / 2 + shiftY;
						ctx.drawImage(this.imgs[imageIndex], x, y, w, h);

						const drawButton = (x, y, sz, text) => {
							const hovered = LiteGraph.isInsideRectangle(mouse[0], mouse[1], x + this.pos[0], y + this.pos[1], sz, sz);
							let fill = "#333";
							let textFill = "#fff";
							let isClicking = false;
							if (hovered) {
								canvas.canvas.style.cursor = "pointer";
								if (canvas.pointer_is_down) {
									fill = "#1e90ff";
									isClicking = true;
								} else {
									fill = "#eee";
									textFill = "#000";
								}
							} else {
								this.pointerWasDown = null;
							}

							ctx.fillStyle = fill;
							ctx.beginPath();
							ctx.roundRect(x, y, sz, sz, [4]);
							ctx.fill();
							ctx.fillStyle = textFill;
							ctx.font = "12px Arial";
							ctx.textAlign = "center";
							ctx.fillText(text, x + 15, y + 20);

							return isClicking;
						};

						if (numImages > 1) {
							if (drawButton(dw - 40, dh + top - 40, 30, `${this.imageIndex + 1}/${numImages}`)) {
								let i = this.imageIndex + 1 >= numImages ? 0 : this.imageIndex + 1;
								if (!this.pointerDown || !this.pointerDown.index === i) {
									this.pointerDown = { index: i, pos: [...mouse] };
								}
							}

							if (drawButton(dw - 40, top + 10, 30, `x`)) {
								if (!this.pointerDown || !this.pointerDown.index === null) {
									this.pointerDown = { index: null, pos: [...mouse] };
								}
							}
						}
					}
				}
			}
		};
	}


	/**
	 * Invoke an extension callback
	 * @param {keyof ComfyExtension} method The extension callback to execute
	 * @param  {any[]} args Any arguments to pass to the callback
	 * @returns
	 */
	#invokeExtensions(method, ...args) {
		let results = [];
		for (const ext of this.extensions) {
			if (method in ext) {
				try {
					results.push(ext[method](...args, this));
				} catch (error) {
					console.error(
						`Error calling extension '${ext.name}' method '${method}'`,
						{ error },
						{ extension: ext },
						{ args }
					);
				}
			}
		}
		return results;
	}


	/**
	 * Invoke an async extension callback
	 * Each callback will be invoked concurrently
	 * @param {string} method The extension callback to execute
	 * @param  {...any} args Any arguments to pass to the callback
	 * @returns
	 */
	async #invokeExtensionsAsync(method, ...args) {
		return await Promise.all(
			this.extensions.map(async (ext) => {
				if (method in ext) {
					try {
						return await ext[method](...args, this);
					} catch (error) {
						console.error(
							`Error calling extension '${ext.name}' method '${method}'`,
							{ error },
							{ extension: ext },
							{ args }
						);
					}
				}
			})
		);
	}


	resizeCanvas() {
		// Limit minimal scale to 1, see https://github.com/comfyanonymous/ComfyUI/pull/845
		const scale = Math.max(window.devicePixelRatio, 1);

		// Clear fixed width and height while calculating rect so it uses 100% instead
		this.canvasEl.height = this.canvasEl.width = "";
		const { width, height } = this.canvasEl.getBoundingClientRect();
		this.canvasEl.width = Math.round(width * scale);
		this.canvasEl.height = Math.round(height * scale);
		this.canvasEl.getContext("2d").scale(scale, scale);
		this.canvas?.draw(true, true);
	}


	showErrorOnFileLoad(file) {
		// this.ui.dialog.show(
		// 	$el("div", [
		// 		$el("p", {textContent: `Unable to find workflow in ${file.name}`})
		// 	]).outerHTML
		// );
		console.log("error happend while laoding")
	}





	/**
	 * Populates the graph with the specified workflow data
	 * @param {*} graphData A serialized graph object
	 * @param { boolean } clean If the graph state, e.g. images, should be cleared
	 * @param { boolean } restore_view If the graph position should be restored
	 * @param { import("./workflows.js").ComfyWorkflowInstance | null } workflow The workflow
	 */
	async loadGraphData(graphData, clean = true, restore_view = true, workflow = null) {
		console.log("loading graph data")
		if (clean !== false) {
			this.clean();
		}

		let reset_invalid_values = false;
		if (!graphData) {
			graphData = defaultGraph;
			reset_invalid_values = true;
		}

		if (typeof structuredClone === "undefined") {
			graphData = JSON.parse(JSON.stringify(graphData));
		} else {
			graphData = structuredClone(graphData);
		}

		// try {
		// 	this.workflowManager.setWorkflow(workflow);
		// } catch (error) {
		// 	console.error(error);
		// }

		const missingNodeTypes = [];
		await this.#invokeExtensionsAsync("beforeConfigureGraph", graphData, missingNodeTypes);
		for (let n of graphData.nodes) {
			// Patch T2IAdapterLoader to ControlNetLoader since they are the same node now
			if (n.type == "T2IAdapterLoader") n.type = "ControlNetLoader";
			if (n.type == "ConditioningAverage ") n.type = "ConditioningAverage"; //typo fix
			if (n.type == "SDV_img2vid_Conditioning") n.type = "SVD_img2vid_Conditioning"; //typo fix

			// Find missing node types
			if (!(n.type in LiteGraph.registered_node_types)) {
				missingNodeTypes.push(n.type);
				n.type = sanitizeNodeName(n.type);
			}
		}

		try {
			this.graph.configure(graphData);
			// if (restore_view && this.enableWorkflowViewRestore.value && graphData.extra?.ds) {
			// 	this.canvas.ds.offset = graphData.extra.ds.offset;
			// 	this.canvas.ds.scale = graphData.extra.ds.scale;
			// }

			// try {
			// 	this.workflowManager.activeWorkflow?.track()
			// } catch (error) {
			// }
		} catch (error) {
			console.error("Error configuring graph", error);
			let errorHint = [];
			// Try extracting filename to see if it was caused by an extension script
			const filename = error.fileName || (error.stack || "").match(/(\/extensions\/.*\.js)/)?.[1];
			const pos = (filename || "").indexOf("/extensions/");
			if (pos > -1) {
				errorHint.push(
					$el("span", { textContent: "This may be due to the following script:" }),
					$el("br"),
					$el("span", {
						style: {
							fontWeight: "bold",
						},
						textContent: filename.substring(pos),
					})
				);
			}

			// Show dialog to let the user know something went wrong loading the data
			// this.ui.dialog.show(
			// 	$el("div", [
			// 		$el("p", { textContent: "Loading aborted due to error reloading workflow data" }),
			// 		$el("pre", {
			// 			style: { padding: "5px", backgroundColor: "rgba(255,0,0,0.2)" },
			// 			textContent: error.toString(),
			// 		}),
			// 		$el("pre", {
			// 			style: {
			// 				padding: "5px",
			// 				color: "#ccc",
			// 				fontSize: "10px",
			// 				maxHeight: "50vh",
			// 				overflow: "auto",
			// 				backgroundColor: "rgba(0,0,0,0.2)",
			// 			},
			// 			textContent: error.stack || "No stacktrace available",
			// 		}),
			// 		...errorHint,
			// 	]).outerHTML
			// );

			return;
		}

		for (const node of this.graph._nodes) {
			const size = node.computeSize();
			size[0] = Math.max(node.size[0], size[0]);
			size[1] = Math.max(node.size[1], size[1]);
			node.size = size;

			if (node.widgets) {
				// If you break something in the backend and want to patch workflows in the frontend
				// This is the place to do this
				for (let widget of node.widgets) {
					if (node.type == "KSampler" || node.type == "KSamplerAdvanced") {
						if (widget.name == "sampler_name") {
							if (widget.value.startsWith("sample_")) {
								widget.value = widget.value.slice(7);
							}
							if (widget.value === "euler_pp" || widget.value === "euler_ancestral_pp") {
								widget.value = widget.value.slice(0, -3);
								for (let w of node.widgets) {
									if (w.name == "cfg") {
										w.value *= 2.0;
									}
								}
							}
						}
					}
					if (node.type == "KSampler" || node.type == "KSamplerAdvanced" || node.type == "PrimitiveNode") {
						if (widget.name == "control_after_generate") {
							if (widget.value === true) {
								widget.value = "randomize";
							} else if (widget.value === false) {
								widget.value = "fixed";
							}
						}
					}
					if (reset_invalid_values) {
						if (widget.type == "combo") {
							if (!widget.options.values.includes(widget.value) && widget.options.values.length > 0) {
								widget.value = widget.options.values[0];
							}
						}
					}
				}
			}

			this.#invokeExtensions("loadedGraphNode", node);
		}

		if (missingNodeTypes.length) {
			//this.showMissingNodesError(missingNodeTypes);
			await this.registerUnknownNodes(missingNodeTypes, graphData);
			await this.loadGraphData(graphData, clean, restore_view, workflow);
		}
		await this.#invokeExtensionsAsync("afterConfigureGraph", missingNodeTypes);
		requestAnimationFrame(() => {
			this.graph.setDirtyCanvas(true, true);
		});
	}

	async registerUnknownNodes(missingNodeTypes, graphData) {
		const defs = {};

		for (const nodetypes of missingNodeTypes) {
			const node = graphData.nodes.find((n) => n.type === nodetypes);
			if (nodetypes in defs) continue;
			defs[nodetypes] = this.registerSingleUnknownNode(node)
		}

		await this.registerNodesFromDefs(defs);
		await this.#invokeExtensionsAsync("registerCustomNodes");



	}


	/**
	 * Clean current state
	 */
	clean() {
		this.nodeOutputs = {};
		this.nodePreviewImages = {}
		this.lastNodeErrors = null;
		this.lastExecutionError = null;
		this.runningNodeId = null;
	}

	/**
	 * Loads workflow data from the specified file
	 * @param {File} file
	 */
	async handleFile(file) {
		const removeExt = f => {
			if (!f) return f;
			const p = f.lastIndexOf(".");
			if (p === -1) return f;
			return f.substring(0, p);
		};

		const fileName = removeExt(file.name);
		if (file.type === "image/png") {
			const pngInfo = await getPngMetadata(file);
			if (pngInfo?.workflow) {
				await this.loadGraphData(JSON.parse(pngInfo.workflow), true, true, fileName);
				// } else if (pngInfo?.prompt) {
				// 	this.loadApiJson(JSON.parse(pngInfo.prompt), fileName);
				// } else if (pngInfo?.parameters) {
				// 	this.changeWorkflow(() => {
				// 		importA1111(this.graph, pngInfo.parameters);
				// 	}, fileName)
			} else {
				this.showErrorOnFileLoad(file);
			}
		} else if (file.type === "image/webp") {
			const pngInfo = await getWebpMetadata(file);
			// Support loading workflows from that webp custom node.
			const workflow = pngInfo?.workflow || pngInfo?.Workflow;
			const prompt = pngInfo?.prompt || pngInfo?.Prompt;

			if (workflow) {
				this.loadGraphData(JSON.parse(workflow), true, true, fileName);
				// } else if (prompt) {
				// 	this.loadApiJson(JSON.parse(prompt), fileName);
			} else {
				this.showErrorOnFileLoad(file);
			}
			// } else if (file.type === "audio/flac" || file.type === "audio/x-flac") {
			// 	const pngInfo = await getFlacMetadata(file);
			// 	// Support loading workflows from that webp custom node.
			// 	const workflow = pngInfo?.workflow;
			// 	const prompt = pngInfo?.prompt;

			// 	if (workflow) {
			// 		this.loadGraphData(JSON.parse(workflow), true, true, fileName);
			// 	} else if (prompt) {
			// 		this.loadApiJson(JSON.parse(prompt), fileName);
			// 	} else {
			// 		this.showErrorOnFileLoad(file);
			// 	}
		} else if (file.type === "application/json" || file.name?.endsWith(".json")) {
			const reader = new FileReader();
			reader.onload = async () => {
				const jsonContent = JSON.parse(reader.result);
				if (jsonContent?.templates) {
					this.loadTemplateData(jsonContent);
					// } else if(this.isApiJson(jsonContent)) {
					// 	this.loadApiJson(jsonContent, fileName);
				} else {
					await this.loadGraphData(jsonContent, true, true, fileName);
				}
			};
			reader.readAsText(file);
			// } else if (file.name?.endsWith(".latent") || file.name?.endsWith(".safetensors")) {
			// 	const info = await getLatentMetadata(file);
			// 	if (info.workflow) {
			// 		await this.loadGraphData(JSON.parse(info.workflow), true, true, fileName);
			// 	} else if (info.prompt) {
			// 		this.loadApiJson(JSON.parse(info.prompt));
			// 	} else {
			// 		this.showErrorOnFileLoad(file);
			// 	}
		} else {
			this.showErrorOnFileLoad(file);
		}
	}


	#importHandler() {
		// Import graph on file upload
		// document.getElementById('importGraph').addEventListener('change', (event) => {
		// 	const file = event.target.files[0];
		// 	// import defs
		// 	if (file) {
		// 		const reader = new FileReader();
		// 		//this.registerNodes();
		// 		reader.onload = (e) => {
		// 			const json = e.target.result;
		// 			this.getDefsFromImportedJson(json);
		// 			this.importGraph(graph, json);
		// 		};
		// 		reader.readAsText(file);
		// 	}
		// 	// import nodes
		// 	if (file) {
		// 		const reader = new FileReader();
		// 		reader.onload = (e) => {
		// 			const json = e.target.result;
		// 			this.importGraph(graph, json);
		// 		};
		// 		reader.readAsText(file);
		// 	}
		// });

		document.getElementById('importGraph').addEventListener('change', (event) => {
			const file = event.target.files[0];
			this.handleFile(file)
		});


	}

	/**
	 * Converts the current graph workflow for sending to the API
	 * @returns The workflow and node links
	 */
	async graphToPrompt(graph = this.graph, clean = true) {
		for (const outerNode of graph.computeExecutionOrder(false)) {
			if (outerNode.widgets) {
				for (const widget of outerNode.widgets) {
					// Allow widgets to run callbacks before a prompt has been queued
					// e.g. random seed before every gen
					widget.beforeQueued?.();
				}
			}

			const innerNodes = outerNode.getInnerNodes ? outerNode.getInnerNodes() : [outerNode];
			for (const node of innerNodes) {
				if (node.isVirtualNode) {
					// Don't serialize frontend only nodes but let them make changes
					if (node.applyToGraph) {
						node.applyToGraph();
					}
				}
			}
		}

		const workflow = graph.serialize();
		const output = {};
		// Process nodes in order of execution
		for (const outerNode of graph.computeExecutionOrder(false)) {
			const skipNode = outerNode.mode === 2 || outerNode.mode === 4;
			const innerNodes = (!skipNode && outerNode.getInnerNodes) ? outerNode.getInnerNodes() : [outerNode];
			for (const node of innerNodes) {
				if (node.isVirtualNode) {
					continue;
				}

				if (node.mode === 2 || node.mode === 4) {
					// Don't serialize muted nodes
					continue;
				}

				const inputs = {};
				const widgets = node.widgets;

				// Store all widget values
				if (widgets) {
					for (const i in widgets) {
						const widget = widgets[i];
						if (!widget.options || widget.options.serialize !== false) {
							inputs[widget.name] = widget.serializeValue ? await widget.serializeValue(node, i) : widget.value;
						}
					}
				}

				// Store all node links
				for (let i in node.inputs) {
					let parent = node.getInputNode(i);
					if (parent) {
						let link = node.getInputLink(i);
						while (parent.mode === 4 || parent.isVirtualNode) {
							let found = false;
							if (parent.isVirtualNode) {
								link = parent.getInputLink(link.origin_slot);
								if (link) {
									parent = parent.getInputNode(link.target_slot);
									if (parent) {
										found = true;
									}
								}
							} else if (link && parent.mode === 4) {
								let all_inputs = [link.origin_slot];
								if (parent.inputs) {
									all_inputs = all_inputs.concat(Object.keys(parent.inputs))
									for (let parent_input in all_inputs) {
										parent_input = all_inputs[parent_input];
										if (parent.inputs[parent_input]?.type === node.inputs[i].type) {
											link = parent.getInputLink(parent_input);
											if (link) {
												parent = parent.getInputNode(parent_input);
											}
											found = true;
											break;
										}
									}
								}
							}

							if (!found) {
								break;
							}
						}

						if (link) {
							if (parent?.updateLink) {
								link = parent.updateLink(link);
							}
							if (link) {
								inputs[node.inputs[i].name] = [String(link.origin_id), parseInt(link.origin_slot)];
							}
						}
					}
				}

				let node_data = {
					inputs,
					class_type: node.comfyClass,
				};

				// if (this.ui.settings.getSettingValue("Comfy.DevMode")) {
				// 	// Ignored by the backend.
				// 	node_data["_meta"] = {
				// 		title: node.title,
				// 	}
				// }

				output[String(node.id)] = node_data;
			}
		}

		// Remove inputs connected to removed nodes
		if(clean) {
			for (const o in output) {
				for (const i in output[o].inputs) {
					if (Array.isArray(output[o].inputs[i])
						&& output[o].inputs[i].length === 2
						&& !output[output[o].inputs[i][0]]) {
						delete output[o].inputs[i];
					}
				}
			}
		}

		return { workflow, output };
	}

	#exportHandler() {
		document.getElementById('exportGraph').addEventListener('click', (event) => {
			console.log("exporting graph")

			let filename = "workflow.json";
			filename = prompt("Save workflow as:", filename);
				if (!filename) return;
				if (!filename.toLowerCase().endsWith(".json")) {
					filename += ".json";
				}
			this.graphToPrompt().then(p => {
				const json = JSON.stringify(p.workflow, null, 2); // convert the data to a JSON string
				const blob = new Blob([json], { type: "application/json" });
				const url = URL.createObjectURL(blob);
				const a = $el("a", {
					href: url,
					download: filename,
					style: { display: "none" },
					parent: document.body,
				});
				a.click();
				setTimeout(function () {
					a.remove();
					window.URL.revokeObjectURL(url);
				}, 0);
			});


		});


	}


	async setup() {
		const mainCanvas = document.createElement("canvas");
		mainCanvas.style.touchAction = "none"
		const canvasEl = (this.canvasEl = Object.assign(mainCanvas, { id: "graph-canvas" }));
		canvasEl.tabIndex = "1";
		document.body.append(canvasEl);
		this.resizeCanvas();
		window.addEventListener("resize", () => this.resizeCanvas());
		const ro = new ResizeObserver(() => this.resizeCanvas());
		ro.observe(this.bodyTop);
		ro.observe(this.bodyLeft);
		ro.observe(this.bodyRight);
		ro.observe(this.bodyBottom);


		this.graph = new LGraph();
		this.canvas = new LGraphCanvas(canvasEl, this.graph);
		this.ctx = canvasEl.getContext("2d");
		this.graph.start();

		this.#importHandler();
		this.#exportHandler();



	}


}




export const app = new ComfyApp();