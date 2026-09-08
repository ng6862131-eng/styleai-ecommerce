import {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaRedo,
  FaPlus,
  FaMinus,
  FaUpload,
  FaTimes,
  FaArrowsAlt,
  FaSearchPlus,
  FaUndo,
} from "react-icons/fa";

import {
  Canvas,
} from "@react-three/fiber";

import {
  OrbitControls,
  RoundedBox,
  Text,
} from "@react-three/drei";

import * as THREE from "three";

import products from "../data/products";
import { useCart } from "../context/CartContext";


/* =========================================================
   3D T-SHIRT MODEL
========================================================= */

function TshirtModel({
  color,
  textRef,
  onTextObjectReady,
  textColor,
  pattern,
  uploadedImage,
  imagePosition,
  imageScale,
  imageRotation,
}) {

  const materialColor = useMemo(
    () => color,
    [color]
  );


  /* =======================================================
     CREATE THREE TEXTURE FROM UPLOADED IMAGE
  ======================================================= */

  const uploadedTexture = useMemo(() => {

    if (!uploadedImage) {
      return null;
    }

    const texture =
      new THREE.Texture(
        uploadedImage
      );

    texture.needsUpdate = true;

    texture.colorSpace =
      THREE.SRGBColorSpace;

    texture.center.set(0.5, 0.5);

    return texture;

  }, [uploadedImage]);


  /* =======================================================
     IMAGE TRANSFORM
  ======================================================= */

  useEffect(() => {

    if (!uploadedTexture) {
      return;
    }

    uploadedTexture.needsUpdate = true;

  }, [
    uploadedTexture,
    imagePosition,
    imageScale,
    imageRotation,
  ]);

  const frontTextRef = useRef(null);
  const imageTextRef = useRef(null);

  useEffect(() => {
    const value = textRef?.current || "";

    if (frontTextRef.current) {
      frontTextRef.current.text = value;
      frontTextRef.current.visible = !uploadedTexture && !!value;
      frontTextRef.current.sync();
    }

    if (imageTextRef.current) {
      imageTextRef.current.text = value;
      imageTextRef.current.visible = !!uploadedTexture && !!value;
      imageTextRef.current.sync();
    }

    onTextObjectReady?.(frontTextRef.current, imageTextRef.current);
  }, [uploadedTexture, textRef, onTextObjectReady]);


  return (
    <group>

      {/* =================================================
          T-SHIRT BODY
      ================================================= */}

      <RoundedBox
        args={[
          3,
          3.4,
          0.82,
        ]}
        radius={0.2}
        smoothness={5}
        position={[0, 0, 0]}
      >

        <meshStandardMaterial
          color={materialColor}
          roughness={0.7}
          metalness={0.02}
        />

      </RoundedBox>


      {/* =================================================
          LEFT SLEEVE
      ================================================= */}

      <RoundedBox
        args={[
          1.1,
          1.9,
          0.75,
        ]}
        radius={0.12}
        smoothness={5}
        position={[
          -1.7,
          0.45,
          0,
        ]}
        rotation={[
          0,
          0,
          -0.32,
        ]}
      >

        <meshStandardMaterial
          color={materialColor}
          roughness={0.7}
        />

      </RoundedBox>


      {/* =================================================
          RIGHT SLEEVE
      ================================================= */}

      <RoundedBox
        args={[
          1.1,
          1.9,
          0.75,
        ]}
        radius={0.12}
        smoothness={5}
        position={[
          1.7,
          0.45,
          0,
        ]}
        rotation={[
          0,
          0,
          0.32,
        ]}
      >

        <meshStandardMaterial
          color={materialColor}
          roughness={0.7}
        />

      </RoundedBox>


      {/* =================================================
          NECK
      ================================================= */}

      <mesh
        position={[
          0,
          1.43,
          0.43,
        ]}
      >

        <torusGeometry
          args={[
            0.43,
            0.115,
            24,
            48,
          ]}
        />

        <meshStandardMaterial
          color="#d9d9d9"
          roughness={0.85}
        />

      </mesh>


      {/* =================================================
          STRIPES
      ================================================= */}

      {pattern === "stripes" && (
        <group>

          <mesh
            position={[
              0,
              0.9,
              0.455,
            ]}
          >

            <boxGeometry
              args={[
                2.3,
                0.09,
                0.025,
              ]}
            />

            <meshStandardMaterial
              color="#ffffff"
            />

          </mesh>


          <mesh
            position={[
              0,
              0.45,
              0.455,
            ]}
          >

            <boxGeometry
              args={[
                2.3,
                0.09,
                0.025,
              ]}
            />

            <meshStandardMaterial
              color="#ffffff"
            />

          </mesh>


          <mesh
            position={[
              0,
              0,
              0.455,
            ]}
          >

            <boxGeometry
              args={[
                2.3,
                0.09,
                0.025,
              ]}
            />

            <meshStandardMaterial
              color="#ffffff"
            />

          </mesh>


          <mesh
            position={[
              0,
              -0.45,
              0.455,
            ]}
          >

            <boxGeometry
              args={[
                2.3,
                0.09,
                0.025,
              ]}
            />

            <meshStandardMaterial
              color="#ffffff"
            />

          </mesh>


          <mesh
            position={[
              0,
              -0.9,
              0.455,
            ]}
          >

            <boxGeometry
              args={[
                2.3,
                0.09,
                0.025,
              ]}
            />

            <meshStandardMaterial
              color="#ffffff"
            />

          </mesh>

        </group>
      )}


      {/* =================================================
          UPLOADED IMAGE
      ================================================= */}

      {uploadedTexture && (

        <mesh
          position={[
            imagePosition.x,
            imagePosition.y,
            0.50,
          ]}
          rotation={[
            0,
            0,
            imageRotation,
          ]}
        >

          <planeGeometry
            args={[
              1.35 * imageScale,
              1.35 * imageScale,
            ]}
          />

          <meshBasicMaterial
            map={uploadedTexture}
            transparent
            depthWrite={false}
          />

        </mesh>

      )}


      {/* =================================================
          CUSTOM TEXT
      ================================================= */}

      <Text
        ref={frontTextRef}
        position={[
          0,
          -0.18,
          0.51,
        ]}
        fontSize={0.27}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        outlineWidth={0.012}
        outlineColor={
          textColor === "#ffffff"
            ? "#111111"
            : "#ffffff"
        }
        visible={!uploadedTexture}
      />


      {/* TEXT BELOW IMAGE */}

      <Text
        ref={imageTextRef}
        position={[
          0,
          -0.82,
          0.51,
        ]}
        fontSize={0.22}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.9}
        outlineWidth={0.012}
        outlineColor={
          textColor === "#ffffff"
            ? "#111111"
            : "#ffffff"
        }
        visible={!!uploadedTexture}
      />


    </group>
  );
}


/* =========================================================
   CUSTOMIZER
========================================================= */

function Customize3D() {

  const { id } = useParams();

  const {
    addToCart,
  } = useCart();


  const product =
    products.find(
      (item) =>
        item.id === Number(id)
    );


  /* =======================================================
     BASIC CUSTOMIZATION
  ======================================================= */

  const [
    selectedColor,
    setSelectedColor,
  ] = useState("#111111");


  const [
    pattern,
    setPattern,
  ] = useState("plain");


  /* =======================================================
     UPLOADED IMAGE
  ======================================================= */

  const [
    uploadedImage,
    setUploadedImage,
  ] = useState(null);


  const customTextRef = useRef("");
  const textCounterRef = useRef(null);
  const liveTextObjectsRef = useRef([null, null]);

  const setLiveTextObjects = useCallback((frontText, imageText) => {
    liveTextObjectsRef.current = [frontText, imageText];
  }, []);

  const updateLiveText = useCallback((value) => {
    customTextRef.current = value;

    const [frontText, imageText] = liveTextObjectsRef.current;

    if (frontText) {
      frontText.text = value;
      frontText.visible = !uploadedImage && !!value;
      frontText.sync();
    }

    if (imageText) {
      imageText.text = value;
      imageText.visible = !!uploadedImage && !!value;
      imageText.sync();
    }

    if (textCounterRef.current) {
      textCounterRef.current.textContent = `${value.length}/18 characters`;
    }
  }, [uploadedImage]);


  const [
    textColor,
    setTextColor,
  ] = useState("#ffffff");


  const [
    size,
    setSize,
  ] = useState(
    product?.sizes?.[0] || "M"
  );


  /* =======================================================
     ZOOM
  ======================================================= */

  const [
    zoom,
    setZoom,
  ] = useState(5);


  /* Keep the Three.js camera configuration stable while typing.
     Without this memo, every character creates a new camera object
     and React Three Fiber can re-apply the camera position, making
     the T-shirt appear to reload/jump. */
  const cameraSettings = useMemo(
    () => ({
      position: [0, 0, zoom],
      fov: 42,
    }),
    [zoom]
  );


  const [
    uploadedImageName,
    setUploadedImageName,
  ] = useState("");


  /* =======================================================
     IMAGE POSITION
  ======================================================= */

  const [
    imagePosition,
    setImagePosition,
  ] = useState({
    x: 0,
    y: 0.38,
  });


  /* =======================================================
     IMAGE SCALE
  ======================================================= */

  const [
    imageScale,
    setImageScale,
  ] = useState(1);


  /* =======================================================
     IMAGE ROTATION
  ======================================================= */

  const [
    imageRotation,
    setImageRotation,
  ] = useState(0);


  /* =======================================================
     COLOUR OPTIONS
  ======================================================= */

  const colorOptions = [
    {
      name: "Black",
      value: "#111111",
    },
    {
      name: "White",
      value: "#f5f5f5",
    },
    {
      name: "Blue",
      value: "#315b9a",
    },
    {
      name: "Red",
      value: "#b83245",
    },
    {
      name: "Green",
      value: "#3f7655",
    },
    {
      name: "Beige",
      value: "#cdb99d",
    },
  ];


  /* =======================================================
     TEXT COLOURS
  ======================================================= */

  const textColors = [
    {
      name: "White",
      value: "#ffffff",
    },
    {
      name: "Black",
      value: "#111111",
    },
    {
      name: "Gold",
      value: "#d4a72c",
    },
    {
      name: "Pink",
      value: "#e96b9a",
    },
  ];


  /* =======================================================
     UPLOAD IMAGE
  ======================================================= */

  const handleImageUpload =
    (event) => {

      const file =
        event.target.files?.[0];


      if (!file) {
        return;
      }


      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        alert(
          "Please select an image file."
        );

        return;
      }


      if (
        file.size >
        4 * 1024 * 1024
      ) {

        alert(
          "Please choose an image smaller than 4 MB."
        );

        return;
      }


      const reader =
        new FileReader();


      reader.onload =
        (loadEvent) => {

          const image =
            new Image();


          image.onload = () => {

            setUploadedImage(
              image
            );

            setUploadedImageName(
              file.name
            );

            setImagePosition({
              x: 0,
              y: 0.38,
            });

            setImageScale(1);

            setImageRotation(0);

          };


          image.src =
            loadEvent.target.result;
        };


      reader.readAsDataURL(
        file
      );
    };


  /* =======================================================
     REMOVE IMAGE
  ======================================================= */

  const handleRemoveImage =
    () => {

      setUploadedImage(null);

      setUploadedImageName("");

      setImagePosition({
        x: 0,
        y: 0.38,
      });

      setImageScale(1);

      setImageRotation(0);
    };


  /* =======================================================
     MOVE IMAGE
  ======================================================= */

  const moveImage = (direction) => {
  setImagePosition((previous) => {

    const imageHalfSize =
      0.675 * imageScale;

    const horizontalLimit =
      Math.max(
        0.15,
        1.35 - imageHalfSize
      );

    const verticalLimit =
      Math.max(
        0.15,
        1.15 - imageHalfSize
      );

    const next = {
      ...previous,
    };

    /* LEFT */
    if (direction === "left") {
      next.x = Math.max(
        -horizontalLimit,
        previous.x - 0.1
      );
    }

    /* RIGHT */
    if (direction === "right") {
      next.x = Math.min(
        horizontalLimit,
        previous.x + 0.1
      );
    }

    /* UP */
    if (direction === "up") {
      next.y = Math.min(
        1.0,
        previous.y + 0.1
      );
    }

    /* DOWN */
    if (direction === "down") {
      next.y = Math.max(
        -0.65,
        previous.y - 0.1
      );
    }

    return next;
  });
};

  /* =======================================================
     IMAGE SIZE
  ======================================================= */

  const changeImageScale =
    (amount) => {

      setImageScale(
        (previous) =>
          Math.min(
            1.8,
            Math.max(
              0.45,
              previous + amount
            )
      ));

  };


  /* =======================================================
     IMAGE ROTATION
  ======================================================= */

  const rotateImage =
    (amount) => {

      setImageRotation(
        (previous) =>
          previous + amount
      );
  };


  /* =======================================================
     RESET IMAGE
  ======================================================= */

  const resetImage =
    () => {

      setImagePosition({
        x: 0,
        y: 0.38,
      });

      setImageScale(1);

      setImageRotation(0);
    };


  /* =======================================================
     ADD CUSTOMIZED PRODUCT
  ======================================================= */

  const handleAddCustomizedProduct =
    () => {

      if (!product) {
        return;
      }


      const colorName =
        colorOptions.find(
          (item) =>
            item.value ===
            selectedColor
        )?.name || "Custom";


      const customizedProduct = {

        ...product,

        name:
          `${product.name} - Custom T-Shirt`,

        price:
          product.price + 300,

        selectedColor:
          colorName,

        selectedSize:
          size,

        customization: {

          productType:
            "T-Shirt",

          pattern,

          text:
            customTextRef.current,

          textColor,

          uploadedImage:
            uploadedImage
              ? uploadedImage.src
              : null,

          uploadedImageName:
            uploadedImageName || "",

          imagePosition:
            uploadedImage
              ? imagePosition
              : null,

          imageScale:
            uploadedImage
              ? imageScale
              : null,

          imageRotation:
            uploadedImage
              ? imageRotation
              : null,
        },
      };


      addToCart(
        customizedProduct,
        customizedProduct.selectedColor,
        customizedProduct.selectedSize,
        1
      );


      alert(
        "Customized T-Shirt added to cart!"
      );
  };


  /* =======================================================
     PRODUCT NOT FOUND
  ======================================================= */

  if (!product) {

    return (
      <div className="customize-not-found">

        <h2>
          T-Shirt not found
        </h2>

        <Link
          to="/shop"
          className="customize-back-btn"
        >
          Back to Shop
        </Link>

      </div>
    );
  }


  return (

    <div className="customize-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="customize-header">

        <Link
          to="/"
          className="customize-back"
        >
          <FaArrowLeft />
          Back to Home
        </Link>


        <Link
          to="/"
          className="customize-logo"
        >
          STYLE<span>AI</span>
        </Link>


        <span className="customize-label">
          3D T-SHIRT STUDIO
        </span>

      </div>


      {/* =================================================
          TITLE
      ================================================= */}

      <div className="customize-title">

        <span>
          STYLEAI CUSTOM STUDIO
        </span>

        <h1>
          Make it
          <em>
            yours.
          </em>
        </h1>

        <p>
          Upload your own image and
          create a personalized T-shirt
          in interactive 3D.
        </p>

      </div>


      {/* =================================================
          MAIN
      ================================================= */}

      <div className="customize-layout">


        {/* =================================================
            3D VIEWER
        ================================================= */}

        <section
          className="customize-viewer"
        >

          <div
            className="viewer-badge"
          >

            <span
              className="viewer-live"
            ></span>

            LIVE 3D PREVIEW

          </div>


          <Canvas

            camera={cameraSettings}

            shadows

            style={{
              width: "100%",
              height: "100%",
              display: "block",
              cursor: "grab",
            }}
          >

            <ambientLight
              intensity={1.6}
            />


            <directionalLight
              position={[
                4,
                6,
                5,
              ]}
              intensity={2}
              castShadow
            />


            <directionalLight
              position={[
                -4,
                2,
                3,
              ]}
              intensity={1}
            />


            <TshirtModel

              color={
                selectedColor
              }

              textRef={customTextRef}

              onTextObjectReady={setLiveTextObjects}

              textColor={
                textColor
              }

              pattern={
                pattern
              }

              uploadedImage={
                uploadedImage
              }

              imagePosition={
                imagePosition
              }

              imageScale={
                imageScale
              }

              imageRotation={
                imageRotation
              }

            />


            <OrbitControls

              makeDefault

              enableRotate

              enableZoom

              enablePan={false}

              minDistance={3.5}

              maxDistance={8}

              rotateSpeed={0.8}

              zoomSpeed={0.8}

              enableDamping

              dampingFactor={0.08}

            />

          </Canvas>


          <div
            className="viewer-hint"
          >
            Drag to rotate •
            Scroll to zoom
          </div>


          <div
            className="viewer-zoom-controls"
          >

            <button
              type="button"
              onClick={() =>
                setZoom(
                  Math.min(
                    8,
                    zoom + 0.5
                  )
                )
              }
              title="Zoom out"
            >
              <FaMinus />
            </button>


            <button
              type="button"
              onClick={() =>
                setZoom(
                  Math.max(
                    3.5,
                    zoom - 0.5
                  )
                )
              }
              title="Zoom in"
            >
              <FaPlus />
            </button>


            <button
              type="button"
              onClick={() =>
                setZoom(5)
              }
              title="Reset zoom"
            >
              <FaRedo />
            </button>

          </div>

        </section>


        {/* =================================================
            CUSTOMIZATION PANEL
        ================================================= */}

        <section
          className="customize-panel"
        >


          {/* PRODUCT */}

          <div
            className="customize-product-name"
          >

            <span>
              CUSTOM T-SHIRT
            </span>

            <h2>
              {product.name}
            </h2>

            <strong>
              ₹{product.price + 300}
            </strong>

            <small>
              Includes ₹300 customization charge
            </small>

          </div>


          {/* =================================================
              COLOUR
          ================================================= */}

          <div
            className="customize-control"
          >

            <div
              className="control-heading"
            >

              <h3>
                T-Shirt Colour
              </h3>

              <span>
                Choose your colour
              </span>

            </div>


            <div
              className="custom-color-grid"
            >

              {colorOptions.map(
                (item) => (

                  <button
                    type="button"
                    key={
                      item.value
                    }
                    className={
                      selectedColor ===
                      item.value
                        ? "custom-color selected"
                        : "custom-color"
                    }
                    onClick={() =>
                      setSelectedColor(
                        item.value
                      )
                    }
                  >

                    <span
                      style={{
                        backgroundColor:
                          item.value,
                      }}
                    ></span>

                    {item.name}

                  </button>

                )
              )}

            </div>

          </div>


          {/* =================================================
              PATTERN
          ================================================= */}

          <div
            className="customize-control"
          >

            <div
              className="control-heading"
            >

              <h3>
                Pattern
              </h3>

              <span>
                Choose a design
              </span>

            </div>


            <div
              className="custom-option-row"
            >

              <button
                type="button"
                className={
                  pattern === "plain"
                    ? "custom-option selected"
                    : "custom-option"
                }
                onClick={() =>
                  setPattern(
                    "plain"
                  )
                }
              >
                Plain
              </button>


              <button
                type="button"
                className={
                  pattern === "stripes"
                    ? "custom-option selected"
                    : "custom-option"
                }
                onClick={() =>
                  setPattern(
                    "stripes"
                  )
                }
              >
                Stripes
              </button>

            </div>

          </div>


          {/* =================================================
              CUSTOM TEXT
          ================================================= */}

          <div
            className="customize-control"
          >

            <div
              className="control-heading"
            >

              <h3>
                Custom Text
              </h3>

              <span>
                Optional
              </span>

            </div>


            <input
              type="text"
              defaultValue=""
              maxLength={18}
              placeholder="Enter text for your T-shirt"
              onChange={(event) =>
                updateLiveText(event.target.value)
              }
              className="custom-text-input"
            />


            <small
              ref={textCounterRef}
              className="input-counter"
            >
              0/18 characters
            </small>

          </div>


          {/* =================================================
              TEXT COLOUR
          ================================================= */}

          <div
            className="customize-control"
          >

            <div
              className="control-heading"
            >

              <h3>
                Text Colour
              </h3>

              <span>
                Choose a colour
              </span>

            </div>


            <div
              className="text-color-row"
            >

              {textColors.map(
                (item) => (

                  <button
                    type="button"
                    key={
                      item.value
                    }
                    className={
                      textColor ===
                      item.value
                        ? "text-color selected"
                        : "text-color"
                    }
                    onClick={() =>
                      setTextColor(
                        item.value
                      )
                    }
                  >

                    <span
                      style={{
                        backgroundColor:
                          item.value,
                      }}
                    ></span>

                    {item.name}

                  </button>

                )
              )}

            </div>

          </div>


          {/* =================================================
              UPLOAD PHOTO
          ================================================= */}

          <div
            className="customize-control"
          >

            <div
              className="control-heading"
            >

              <h3>
                Upload Photo
              </h3>

              <span>
                Optional
              </span>

            </div>


            <label
              htmlFor="tshirt-image-upload"
              className="custom-upload-btn"
            >

              <FaUpload />

              <span>
                Choose from Gallery
              </span>

            </label>


            <input
              id="tshirt-image-upload"
              type="file"
              accept="
                image/png,
                image/jpeg,
                image/webp
              "
              onChange={
                handleImageUpload
              }
              style={{
                display: "none",
              }}
            />


            {uploadedImageName && (

              <div
                className="uploaded-image-info"
              >

                <span>
                  🖼️{" "}
                  {uploadedImageName}
                </span>

                <button
                  type="button"
                  onClick={
                    handleRemoveImage
                  }
                  title="Remove uploaded image"
                >
                  <FaTimes />
                </button>

              </div>

            )}


            <small
              className="upload-help"
            >
              JPG, PNG or WebP •
              Max 4 MB
            </small>

          </div>


          {/* =================================================
              IMAGE CONTROLS
          ================================================= */}

          {uploadedImage && (

            <div
              className="customize-control image-controls"
            >

              <div
                className="control-heading"
              >

                <h3>
                  Image Controls
                </h3>

                <span>
                  Adjust your design
                </span>

              </div>


              {/* MOVE */}

              <div
                className="image-control-group"
              >

                <div
                  className="image-control-title"
                >
                  <FaArrowsAlt />
                  Position
                </div>


                <div
                  className="image-move-grid"
                >

                  <button
                    type="button"
                    onClick={() =>
                      moveImage("up")
                    }
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      moveImage("left")
                    }
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      moveImage("down")
                    }
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      moveImage("right")
                    }
                  >
                    →
                  </button>

                </div>

              </div>


              {/* SIZE */}

              <div
                className="image-control-group"
              >

                <div
                  className="image-control-title"
                >
                  <FaSearchPlus />
                  Image Size
                </div>


                <div
                  className="image-action-row"
                >

                  <button
                    type="button"
                    onClick={() =>
                      changeImageScale(
                        -0.1
                      )
                    }
                  >
                    <FaMinus />
                    Smaller
                  </button>

                  <span>
                    {Math.round(
                      imageScale * 100
                    )}
                    %
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      changeImageScale(
                        0.1
                      )
                    }
                  >
                    <FaPlus />
                    Larger
                  </button>

                </div>

              </div>


              {/* ROTATE */}

              <div
                className="image-control-group"
              >

                <div
                  className="image-control-title"
                >
                  <FaRedo />
                  Rotate Image
                </div>


                <div
                  className="image-action-row"
                >

                  <button
                    type="button"
                    onClick={() =>
                      rotateImage(
                        -Math.PI / 12
                      )
                    }
                  >
                    ↶ Rotate Left
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      rotateImage(
                        Math.PI / 12
                      )
                    }
                  >
                    ↷ Rotate Right
                  </button>

                </div>

              </div>


              {/* RESET */}

              <button
                type="button"
                className="image-reset-btn"
                onClick={
                  resetImage
                }
              >
                <FaUndo />
                Reset Image Position
              </button>

            </div>

          )}


          {/* =================================================
              SIZE
          ================================================= */}

          <div
            className="customize-control"
          >

            <div
              className="control-heading"
            >

              <h3>
                Size
              </h3>

              <span>
                Select size
              </span>

            </div>


            <div
              className="size-choice-row"
            >

              {product.sizes?.map(
                (item) => (

                  <button
                    type="button"
                    key={item}
                    className={
                      size === item
                        ? "size-choice selected"
                        : "size-choice"
                    }
                    onClick={() =>
                      setSize(item)
                    }
                  >
                    {item}
                  </button>

                )
              )}

            </div>

          </div>


          {/* =================================================
              ADD TO CART
          ================================================= */}

          <button
            type="button"
            className="customize-add-btn"
            onClick={
              handleAddCustomizedProduct
            }
          >

            <span>
              Add Customized T-Shirt
            </span>

            <FaArrowLeft
              style={{
                transform:
                  "rotate(180deg)",
              }}
            />

          </button>

        </section>

      </div>

    </div>
  );
}

export default Customize3D;