import React, { useState } from "react";
import "./ComputerGraphics.css";

import Project from "../components/Project";
import ImageWithCaption from "../components/ImageWithCaption";
import { rayTracer } from "../codeSnippets/rayTracerSnippet.js";
import {
  simpleGeometryHullSnippet,
  simpleGeometryInsideSnippet
} from "../codeSnippets/simpleGeometry";

import {
  mainTextureMapping,
  openGlShader
} from "../codeSnippets/textureMapping";

const ComputerGraphics = () => {
  const rayTracingDescription = (
    <p>
      Here are some images I produced as part of a project to write a{" "}
      <a href="https://en.wikipedia.org/wiki/Ray_tracing_(graphics)">
        ray-tracing
      </a>{" "}
      image renderer.
    </p>
  );

  const textureMappingDescription = (
    <div>
      <p>
        This assignment was to implement{" "}
        <a href="https://en.wikipedia.org/wiki/Texture_mapping">
          basic texturing techniques
        </a>{" "}
        used in 3D rasterization pipelines.
      </p>
      <p>
        Texture mapping allows detailed image textures to be mapped onto simpler
        objects, lending them a more realistic appearance.
      </p>
      <p>
        See below the 2D textures that are then mapped onto the corresponding 3D
        objects.
      </p>
    </div>
  );

  const basicGeometryDescription = (
    <div>
      <p>
        This was our first project and served as a primer on C++ and an intro to
        coding in reference to geometric spaces.
      </p>
      <p>
        The assignment was to write two programs that both performed operations
        on a collection of points in 2D-space.
      </p>
      <p>
        The first program took as input a list representation of points in 2D
        space and generated the convex-hull (the smallest bounding polygon) of
        the points. This was executed using the{" "}
        <a href="https://en.wikipedia.org/wiki/Graham_scan">Graham Scan</a>{" "}
        algorithm.
      </p>
      <p>
        The second program took a list of points as input, as well as a polygon
        represented as a list of vectors. The program then computed which of the
        points fell within the given polygon using the{" "}
        <a href="https://en.wikipedia.org/wiki/Point_in_polygon">
          Point in Polygon
        </a>{" "}
        test.
      </p>
    </div>
  );
  return (
    <div style={{ margin: "60px" }} className="overflow-auto ">
      <h1>Computer Graphics</h1>
      <p>
        On this page you can find some of the images produced from a few of the
        graphics projects I completed during my CG course at NYU, along with
        some of the associated code.
      </p>

      <Project
        projectName="Ray Tracing"
        projectDescription={rayTracingDescription}
        images={[
          <ImageWithCaption
            imageSrc={process.env.PUBLIC_URL + "/images/finalRender.png"}
          />,
          <ImageWithCaption
            imageSrc={process.env.PUBLIC_URL + "/images/depthOfField.png"}
          />
        ]}
        codeSnippets={[
          {
            name: "Ray Tracer",
            codeSnippet: rayTracer
          }
        ]}
      />
      <Project
        projectName="Texture Mapping"
        projectDescription={textureMappingDescription}
        images={[
          <ImageWithCaption
            imageSrc={process.env.PUBLIC_URL + "/images/bananaUVCoords.png"}
            caption="A banana texture map overlaid with the correpsonding UV coordinates."
          />,
          <ImageWithCaption
            imageSrc={process.env.PUBLIC_URL + "/images/banana.png"}
            caption="The object with this texture applied"
          />,
          <ImageWithCaption
            imageSrc={process.env.PUBLIC_URL + "/images/OrangeUVCoords.png"}
            caption="The rendered orange."
          />,
          <ImageWithCaption
            imageSrc={process.env.PUBLIC_URL + "/images/orange.png"}
            caption="The rendered orange."
          />
        ]}
        codeSnippets={[
          { name: "Main File", codeSnippet: mainTextureMapping },
          { name: "Shader", codeSnippet: openGlShader }
        ]}
      />
      <Project
        projectName="Basic Geometry"
        projectDescription={basicGeometryDescription}
        images={[
          <ImageWithCaption
            imageSrc={process.env.PUBLIC_URL + "/images/convex_hull_result.png"}
            caption="The convex-hull."
          />,

          <ImageWithCaption
            imageSrc={
              process.env.PUBLIC_URL + "/images/point_in_poly_results.png"
            }
            caption="The points found within the polygon colored red."
          />
        ]}
        codeSnippets={[
          {
            name: "Convex Hull",
            codeSnippet: simpleGeometryHullSnippet
          },
          {
            name: "Point Inside Polygon",
            codeSnippet: simpleGeometryInsideSnippet
          }
        ]}
      />
    </div>
  );
};

export default ComputerGraphics;
