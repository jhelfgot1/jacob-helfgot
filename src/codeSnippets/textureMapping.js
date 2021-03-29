export const mainTextureMapping = `struct Mesh {
	Eigen::MatrixXf V; // vertices positions [3 x n]
    Eigen::MatrixXf originalV; // vertices positions [3 x n]
    Eigen::MatrixXf originalVN; // vertices positions [3 x n]
	Eigen::MatrixXf VT; // texture coordinates [2 x n]
	Eigen::MatrixXf VN; // vertices normals [3 x n]
	Eigen::MatrixXi F; // triangles indices [3 x m]

	Eigen::MatrixXf textureCoords; //uv texture coordinates [2 X m]
	Eigen::Matrix4f initialTransformation = Eigen::Matrix4f::Identity();
	Eigen::Matrix4f initialTransformationNormals = Eigen::Matrix4f::Identity();

	// VBO storing vertex position attributes
	VertexBufferObject V_vbo;
	VertexBufferObject tex_vbo;
    VertexBufferObject norm_vbo;


	// VBO storing vertex indices (element buffer)
	VertexBufferObject F_vbo;

	// VAO storing the layout of the shader program for the object 'fruit'
	VertexArrayObject vao;

	// Texture data
	Image pixels_color; // 2D array of pixel data
    Image normal_texture;
    GLuint textures[2];
};

Mesh fruit;
int currentModel;
bool showingUVMapping;
bool usingMultipleTextures;
bool useBumpMapping;
////////////////////////////////////////////////////////////////////////////////

void compute_tangent_frame(
	const Eigen::MatrixXf &V, const Eigen::MatrixXf &VN,
	const Eigen::MatrixXf &VT, const Eigen::MatrixXi &F,
	Eigen::MatrixXf &T, Eigen::MatrixXf &B)
{
	//////////
	// TODO (Ex.4, Optional):
	// Compute the tangent frame formed by (T,B,N), such that T and B follows
	// the direction of U and V respectively.
	//////////

	T.resizeLike(V);
	B.resizeLike(V);
	T.setZero();
	B.setZero();
}

void generateInitialScale() {
    Eigen::Matrix4f initialTranslation0 = Eigen::Matrix4f::Identity();
    Eigen::Matrix4f initialTranslation1 = Eigen::Matrix4f::Identity();
    Eigen::Matrix4f initialScale = Eigen::Matrix4f::Identity();

    float currentMeshMaxValX;
    float currentMeshMaxValY;
    float currentMeshMaxValZ;
    float currentMeshMinValX;
    float currentMeshMinValY;
    float currentMeshMinValZ;

    for (int i = 0; i < fruit.V.cols(); i++) {

        if (i == 0) {
            currentMeshMaxValX = fruit.V(0, i);
            currentMeshMaxValY = fruit.V(1, i);
            currentMeshMaxValZ = fruit.V(2, i);
            currentMeshMinValX = fruit.V(0, i);
            currentMeshMinValY = fruit.V(1, i);
            currentMeshMinValZ = fruit.V(2, i);


        } else {

            if (fruit.V(0, i) > currentMeshMaxValX) {

                currentMeshMaxValX = fruit.V(0, i);
            }

            if (fruit.V(1, i) > currentMeshMaxValY) {
                currentMeshMaxValY = fruit.V(1, i);
            }
            if (fruit.V(2, i) > currentMeshMaxValZ) {
                currentMeshMaxValZ = fruit.V(2, i);
            }

            if (fruit.V(0, i) < currentMeshMinValX) {

                currentMeshMinValX = fruit.V(0, i);
            }
            if (fruit.V(1, i) < currentMeshMinValY) {
                currentMeshMinValY = fruit.V(1, i);
            }
            if (fruit.V(2, i) < currentMeshMinValZ) {
                currentMeshMinValZ = fruit.V(2, i);
            }


        }
    }

    initialTranslation0(0, 3) = -currentMeshMinValX;
    initialTranslation0(1, 3) = -currentMeshMinValY;
    initialTranslation0(2, 3) = -currentMeshMinValZ;


    initialScale(0, 0) = 1 / (currentMeshMaxValX - currentMeshMinValX);
    initialScale(1, 1) = 1 / (currentMeshMaxValY - currentMeshMinValY);
    initialScale(2, 2) = 1 / (currentMeshMaxValZ - currentMeshMinValZ);

    for (int i = 0; i < 3; i++) {
        if (isinf(initialScale(i, i))) {
            initialScale(i,i) = 1;
        }
    }

    initialTranslation1(0, 3) = -0.5;
    initialTranslation1(1, 3) = -0.5;
    initialTranslation1(2, 3) = -0.5;


    fruit.initialTransformation = initialTranslation1 * initialScale * initialTranslation0;
	fruit.initialTransformationNormals = fruit.initialTransformation.transpose().inverse();

}

void applyInitialTransformation() {
	Eigen::MatrixXf newV(fruit.V.rows(), fruit.V.cols()); // vertices positions [3 x n]
	Eigen::MatrixXf newVN(fruit.VN.rows(), fruit.VN.cols()); // vertices positions [3 x n]VN
	Eigen::Vector4f homogVect;
	Eigen::Vector3f newCol;
	for (int i = 0; i < fruit.V.cols(); i++) {
		homogVect = {fruit.V(0, i), fruit.V(1, i), fruit.V(2, i), 1.0};
		homogVect = fruit.initialTransformation*homogVect;
		newCol = {homogVect(0), homogVect(1), homogVect(2)};
		newV.col(i) = newCol;
	}

	for (int i =0 ; i < fruit.VN.cols(); i++) {
		homogVect = {fruit.VN(0, i), fruit.VN(1, i), fruit.VN(2, i), 1.0};
		homogVect = fruit.initialTransformationNormals * homogVect;
		newCol = {homogVect(0), homogVect(1), homogVect(2)};
		newVN.col(i) = newCol;
	}


	fruit.V = newV;
	fruit.VN = newVN;
	// Set transformation matrix for normals m.initialTransformationNormal = ...


}

void toggleUVMapping() {
	if (!showingUVMapping) {
		Eigen::MatrixXf newV(fruit.V.rows(), fruit.V.cols());
		Eigen::MatrixXf newVN(fruit.VN.rows(), fruit.VN.cols());

		Eigen::Vector2f currentUV;
		Eigen::Vector3f newVCol;
        Eigen::Vector3f newVNCol;
		for (int i = 0; i < newV.cols(); i++) {
			currentUV = fruit.VT.col(i);
			newVCol = {currentUV[0] - .5 , currentUV[1] - .5, 0};
			newV.col(i) = newVCol;
			newVNCol = {0.0f, 0.0f, 1.0f};
            newVN.col(i) = newVNCol;
        }

        showingUVMapping = true;

        fruit.V = newV;
        fruit.VN = newVN;
        fruit.V_vbo.update(newV);
        fruit.norm_vbo.update(newVN);
	}


}


void load_model(const std::string &mesh_filename,
	const std::string &color_filename, const std::string &bump_filename) {
    // Load the model
    Eigen::MatrixXf V, VT, VN;
    Eigen::MatrixXi F, FT, FN;
    load_obj(std::string(DATA_DIR) + mesh_filename, V, VT, VN, F, FT, FN);
    assert(F.cols() == FT.cols() && FT.cols() == FN.cols());


    Eigen::MatrixXf newV(3, 3 * F.cols());
    Eigen::MatrixXi newF(3, F.cols());
    Eigen::MatrixXf newVT(2, 3 * F.cols());
    Eigen::MatrixXf newNormals(3, 3 * F.cols());

    fruit.V = V;
    generateInitialScale();

    for (int i = 0; i < F.cols(); i++) {
        for (int j = 0; j < 3; j++) {
            newV.col((i*3) + j) = V.col(F(j, i));
            newF(j, i) = (i * 3) + j;
            newVT.col((i*3) + j) = VT.col(FT(j,i));
            newNormals.col((i * 3) + j) = VN.col(FN(j,i));
        }
    }

//    std::cout << newVT.cols() <<std::endl;
//    std::cout << newV.cols() <<std::endl;
//    std::cout << newF.cols() <<std::endl;
    fruit.V = newV;
    fruit.F = newF;
    fruit.VT = newVT;
    fruit.VN = newNormals;

    // Compute tangent frame
    // compute_tangent_frame(fruit.V, fruit.VN, fruit.VT, fruit.F, fruit.T, fruit.B);

    // Update GPU data
    glBindVertexArray(0);


    // Load textures
    load_image(std::string(DATA_DIR) + color_filename, fruit.pixels_color);
    load_image(std::string(DATA_DIR) + bump_filename, fruit.normal_texture);

    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, fruit.textures[0]);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
                 fruit.pixels_color.rows(), fruit.pixels_color.cols(),
                 0, GL_RGBA, GL_UNSIGNED_BYTE,
                 reinterpret_cast<unsigned char *>(fruit.pixels_color.data()));


    glActiveTexture(GL_TEXTURE1);
    glBindTexture(GL_TEXTURE_2D, fruit.textures[1]);
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
                 fruit.normal_texture.rows(), fruit.normal_texture.cols(),
                 0, GL_RGBA, GL_UNSIGNED_BYTE,
                 reinterpret_cast<unsigned char *>(fruit.normal_texture.data()));



    applyInitialTransformation();
    fruit.originalV = fruit.V;
    fruit.originalVN = fruit.VN;

    fruit.F_vbo.update(fruit.F);
    fruit.V_vbo.update(fruit.V);
    fruit.tex_vbo.update(fruit.VT);
    fruit.norm_vbo.update(fruit.VN);


}

void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods) {
	if (action == GLFW_PRESS) {
		// Update the position of the first vertex if the keys 1,2, or 3 are pressed
		switch (key) {
			case GLFW_KEY_1:
				useBumpMapping = false;
				load_model("orange.obj", "orange.color.png", "orange.bump.png");
				currentModel = 1;
                usingMultipleTextures = false;
                showingUVMapping = false;
				break;
			case GLFW_KEY_2:
				useBumpMapping = false;
				load_model("banana.obj", "banana.color.png", "banana.bump.png");
				currentModel = 2;
                usingMultipleTextures = false;
                showingUVMapping = false;
                break;
			case GLFW_KEY_3:
				useBumpMapping = false;
				currentModel = 3;
				load_model("wall.obj", "wall.color.jpg", "wall.bump.jpg");
                usingMultipleTextures = false;
                showingUVMapping = false;
                break;
			case GLFW_KEY_4:
				useBumpMapping = false;
				currentModel = 3;
                showingUVMapping = false;
                usingMultipleTextures = true;
				load_model("wall.obj", "wall.color.jpg", "wall.normal.jpg");
                break;

			case GLFW_KEY_5:
				useBumpMapping = false;
				currentModel =4;
                usingMultipleTextures = false;
				load_model("sphere.obj", "wall.color.jpg", "wall.bump.jpg");
                showingUVMapping = false;
				break;
			case GLFW_KEY_U:
				useBumpMapping = false;
				usingMultipleTextures = false;
				if (!showingUVMapping) {
					toggleUVMapping();
				}
				break;
			case GLFW_KEY_B:
				useBumpMapping = true;
				break;
			default:
				break;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////

int main(void) {
	// Initialize the GLFW library
	if (!glfwInit()) {
		return -1;
	}

	// Activate supersampling
	glfwWindowHint(GLFW_SAMPLES, 8);

	// Ensure that we get at least a 3.2 context
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 2);

	// On apple we have to load a core profile with forward compatibility
#ifdef __APPLE__
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
	glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
#endif

	// Create a windowed mode window and its OpenGL context
	GLFWwindow * window = glfwCreateWindow(640, 640, "[Float] Hello World", NULL, NULL);
	if (!window) {
		glfwTerminate();
		return -1;
	}

	std::cout << "Offset" <<std::endl;
	std::cout << GL_MIN_PROGRAM_TEXEL_OFFSET<<std::endl;
	std::cout << GL_MAX_PROGRAM_TEXEL_OFFSET<<std::endl;

	// Make the window's context current
	glfwMakeContextCurrent(window);

	// Load OpenGL and its extensions
	if (!gladLoadGL()) {
		printf("Failed to load OpenGL and its extensions");
		return(-1);
	}
	printf("OpenGL Version %d.%d loaded", GLVersion.major, GLVersion.minor);

	int major, minor, rev;
	major = glfwGetWindowAttrib(window, GLFW_CONTEXT_VERSION_MAJOR);
	minor = glfwGetWindowAttrib(window, GLFW_CONTEXT_VERSION_MINOR);
	rev = glfwGetWindowAttrib(window, GLFW_CONTEXT_REVISION);
	printf("OpenGL version recieved: %d.%d.%d\n", major, minor, rev);
	printf("Supported OpenGL is %s\n", (const char*)glGetString(GL_VERSION));
	printf("Supported GLSL is %s\n", (const char*)glGetString(GL_SHADING_LANGUAGE_VERSION));

	// Initialize the OpenGL Program
	// A program controls the OpenGL pipeline and it must contains
	// at least a vertex shader and a fragment shader to be valid
	Program program;
	std::string vertex_shader = load_text(SHADER_DIR "shader.vert");
	std::string fragment_shader = load_text(SHADER_DIR "shader.frag");

	// Compile the two shaders and upload the binary to the GPU
	// Note that we have to explicitly specify that the output "slot" called outColor
	// is the one that we want in the fragment buffer (and thus on screen)
	program.init(vertex_shader, fragment_shader, "outColor");

	// Prepare a dummy fruit object
	// We need to initialize and fill the two VBO (vertex positions + indices),
	// and use a VAO to store their layout when we use our shader program later.
	{
		// Initialize the VBOs
		fruit.V_vbo.init(GL_FLOAT, GL_ARRAY_BUFFER);
        fruit.tex_vbo.init(GL_FLOAT, GL_ARRAY_BUFFER);
        fruit.norm_vbo.init(GL_FLOAT, GL_ARRAY_BUFFER);

		fruit.F_vbo.init(GL_UNSIGNED_INT, GL_ELEMENT_ARRAY_BUFFER);

		// Vertex positions
		fruit.V.resize(3, 3);
		fruit.V <<
			0, 0.5, -0.5,
			0.5, -0.5, -0.5,
			0, 0, 0;
		fruit.V_vbo.update(fruit.V);

		// Normals
		fruit.VN.resize(3, 3);
		fruit.VN <<
			0, 0, 0,
			0, 0, 0,
			1, 1, 1;

        fruit.norm_vbo.update(fruit.VN);

		// Texture coordinates
		fruit.VT.resize(2, 3);
		fruit.VT <<
			0, 0, 1,
			0, 1, 0;
        fruit.tex_vbo.update(fruit.VT);

		// Triangle indices
		fruit.F.resize(3, 1);
		fruit.F << 0, 1, 2;
		fruit.F_vbo.update(fruit.F);

		// Texture id
		glGenTextures(0, &fruit.textures[0]);
        glGenTextures(1, &fruit.textures[1]);

		float pixels[] = {
			1.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f,
			0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f
		};

		// Bind texture and upload data to GPU
		glBindTexture(GL_TEXTURE_2D, fruit.textures[0]);
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, 2, 2, 0, GL_RGB, GL_FLOAT, pixels);
		// Set interpolation parameters for the currently bound texture
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

        glBindTexture(GL_TEXTURE_2D, fruit.textures[1]);
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, 2, 2, 0, GL_RGB, GL_FLOAT, pixels);

        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

		// Create a new VAO for the fruit. and bind it
		fruit.vao.init();
		fruit.vao.bind();

		// Bind the element buffer, this information will be stored in the current VAO
		fruit.F_vbo.bind();

		// The vertex shader wants the position of the vertices as an input.
		// The following line connects the VBO we defined above with the position "slot"
		// in the vertex shader
		program.bindVertexAttribArray("vtxPosition", fruit.V_vbo);
        program.bindVertexAttribArray("vtxTexCoord", fruit.tex_vbo);
        program.bindVertexAttribArray("vtxNormal", fruit.norm_vbo);

		// Unbind the VAO when I am done
		fruit.vao.unbind();

    }


	// For the first exercises, 'view' and 'proj' will be the identity matrices
	// However, the 'model' matrix must change for each model in the scene
	Eigen::Matrix4f modelMatrix = Eigen::Matrix4f::Identity();
	Eigen::Matrix4f viewMatrix = Eigen::Matrix4f::Identity();
	Eigen::Matrix4f projMatrix = Eigen::Matrix4f::Identity();
	Eigen::Matrix4f normalMatrix = Eigen::Matrix4f::Identity();
	projMatrix(2, 2) = -1; // Projection matrix in OpenGL inverts the Z coordinate
	program.bind();
	glUniformMatrix4fv(program.uniform("view"), 1, GL_FALSE, viewMatrix.data());
	glUniformMatrix4fv(program.uniform("proj"), 1, GL_FALSE, projMatrix.data());

	// Save the current time --- it will be used to dynamically change the triangle color
	auto t_start = std::chrono::high_resolution_clock::now();

	// Register the keyboard callback
	glfwSetKeyCallback(window, key_callback);

	// Loop until the user closes the window
	while (!glfwWindowShouldClose(window)) {
		// Set the size of the viewport (canvas) to the size of the application window (framebuffer)
		int width, height;
		glfwGetFramebufferSize(window, &width, &height);
		glViewport(0, 0, width, height);

		// Clear the framebuffer
		glClearColor(0.5f, 0.5f, 0.5f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		// Enable depth test
		glEnable(GL_DEPTH_TEST);
        glDisable(GL_CULL_FACE);

		// Bind your program
		program.bind();
        glUniform3f(program.uniform("meshColor"),0.0, 0.0, 0.0);
        if (usingMultipleTextures) {
            glUniform1f(program.uniform("shadingMode"), 2);
        }
        else if (useBumpMapping){
			glUniform1f(program.uniform("shadingMode"), 3);
        }
		else {
			glUniform1f(program.uniform("shadingMode"), 0);
		}


		{
			// Bind the VAO for the fruit
			fruit.vao.bind();

			//////////
			// TODO: Bind the fruit texture to the texture unit 0
			//////////


			//////////
			// TODO: Set the sampler 'colorSampler' to use the texture unit 0
			//////////

            glActiveTexture(GL_TEXTURE0);
            glBindTexture(GL_TEXTURE_2D, fruit.textures[0]);
            glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
                         fruit.pixels_color.rows(), fruit.pixels_color.cols(),
                         0, GL_RGBA, GL_UNSIGNED_BYTE,
                         reinterpret_cast<unsigned char *>(fruit.pixels_color.data()));

            glUniform1i(glGetUniformLocation(program.program_shader, "texColor"), 0);

            glActiveTexture(GL_TEXTURE1);
            glBindTexture(GL_TEXTURE_2D, fruit.textures[1]);
            glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA,
                         fruit.normal_texture.rows(), fruit.normal_texture.cols(),
                         0, GL_RGBA, GL_UNSIGNED_BYTE,
                         reinterpret_cast<unsigned char *>(fruit.normal_texture.data()));

            glUniform1i(glGetUniformLocation(program.program_shader, "texNormal"), 1);

			// Model matrix for the fruit
			glUniformMatrix4fv(program.uniform("model"), 1, GL_FALSE, modelMatrix.data());

			// Transform normals from the obj space to the camera space
			glUniformMatrix4fv(program.uniform("normalMatrix"), 1, GL_FALSE, normalMatrix.data());

			// Set the uniform value depending on the time difference
            auto t_now = std::chrono::high_resolution_clock::now();
            float time = std::chrono::duration_cast<std::chrono::duration<float>>(t_now - t_start).count();

			if (currentModel == 3) {
				glUniform3f(program.uniform("lightPosition"), .5f*cos(time), .5f*sin(time), 1.0);
			}
			else {
				glUniform3f(program.uniform("lightPosition"), .70f*cos(time), .70f*sin(time), 1.0);
			}


            glPolygonMode( GL_FRONT_AND_BACK, GL_FILL );

			// Draw the triangles
			glDrawElements(GL_TRIANGLES, 3 * fruit.F.cols(), fruit.F_vbo.scalar_type, 0);
            if (showingUVMapping) {
                glUniform1f(program.uniform("shadingMode"), 1);
                for (int i = 0; i < fruit.V.cols(); i++) {
                    fruit.V(2, i) = (.1);
                }
                fruit.V_vbo.update(fruit.V);
                glPolygonMode( GL_FRONT_AND_BACK, GL_LINE );

                glDrawElements(GL_TRIANGLES, 3 * fruit.F.cols(), fruit.F_vbo.scalar_type, 0);

                glUniform1f(program.uniform("shadingMode"), 0);
                for (int i = 0; i < fruit.V.cols(); i++) {
                    fruit.V(2, i) = (0);
                }
                fruit.V_vbo.update(fruit.V);

            }
		}

		// Swap front and back buffers
		glfwSwapBuffers(window);

		// Poll for and process events
		glfwPollEvents();
	}

	// Deallocate opengl memory
	program.free();
	fruit.vao.free();
	fruit.V_vbo.free();
	fruit.F_vbo.free();
    fruit.norm_vbo.free();
    fruit.tex_vbo.free();
	glDeleteTextures(1, &fruit.textures[0]);
    glDeleteTextures(1, &fruit.textures[1]);

	// Deallocate glfw internals
	glfwTerminate();
	return 0;
}`;

export const openGlShader = `#version 150 core
uniform sampler2D texColor;
uniform sampler2D texNormal;

uniform vec3 lightPosition;
uniform float shadingMode;
uniform vec3 meshColor;

in vec3 eyePosition;
in vec3 eyeNormal;
in vec2 texCoord;
in vec2 normalCoord;



out vec4 outColor;

vec3 compute_normal() {

	return normalize(eyeNormal);
}


vec3 mapNormalValue(vec3 norm) {
    return (2 * (norm)) - 1;

}

vec3 compute_textured_normal() {
	vec3 normalFromTexture = normalize(mapNormalValue(vec3(texture(texNormal, texCoord))));
	return normalFromTexture;
}

vec3 compute_bump_normal() {
    float heightx1 = textureOffset(texNormal, texCoord, ivec2(-1, 0))[0];
    float heightx2 = textureOffset(texNormal, texCoord, ivec2(1, 0))[0];
    float heighty1 = textureOffset(texNormal, texCoord, ivec2(0, -1))[0];
    float heighty2 = textureOffset(texNormal, texCoord, ivec2(0, 1))[0];
    vec3 t1 = vec3(1, 0, heightx2 - heightx1);
    vec3 t2 = vec3(0, 1, heighty2 - heighty1);
 	return normalize(cross(t1, t2));
}

void main() {
	// Shading
    vec3 Ka = vec3(0.200000, 0.200000, 0.200000);
    vec3 Kd = vec3(0.749020, 0.749020, 0.749020);
    vec3 Ks = vec3(0.500000, 0.500000, 0.500000);
    float shininess = 100.0;

    vec3 ambientColor = vec3(1, 1, 1);
    vec3 diffuseColor = vec3(1, 1, 1);
    vec3 specularColor = vec3(1, 1, 1);

	if (shadingMode != 1) {

    	// Compute the normal to the fragment
        vec3 N;
    	if (shadingMode == 0) {
    	    N = compute_normal();
    	}
        else if (shadingMode == 3){
            N = compute_bump_normal();
        }
    	else {
    	    N = compute_textured_normal();
    	}


    	vec3 v = normalize((-1 * eyePosition + lightPosition));

        float lambertian = min(1, max(0, dot(N, lightPosition - eyePosition)));
    	float specular = pow(max(0, dot(N, v)), 50);
    	vec3 shadedColor = vec3(Ka * ambientColor + Kd * lambertian * diffuseColor + Ks * specular * specularColor);

    	// Draw the light bulb
    	if (distance(eyePosition.xy, lightPosition.xy) < .1) {
    		outColor = vec4(1, 1, 0, 0);
    		return;
    	}
    	else {


        	outColor = texture(texColor, texCoord) * vec4(shadedColor, 1.0);
        	return;
    	}

	}


	else if (shadingMode == 1) {
	    outColor = vec4(meshColor, 1.0);
	}
}`;
