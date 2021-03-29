export const rayTracer = `////////////////////////////////////////////////////////////////////////////////
// C++ include
#include <fstream>
#include <iostream>
#include <limits>
#include <memory>
#include <string>
#include <vector>

// Eigen for matrix operations
#include <Eigen/Dense>

// Image writing library
#define STB_IMAGE_WRITE_IMPLEMENTATION // Do not include this line twice in your project!
#include "stb_image_write.h"
#include "utils.h"

// JSON parser library (https://github.com/nlohmann/json)
#include "json.hpp"
using json = nlohmann::json;

// Shortcut to avoid Eigen:: everywhere, DO NOT USE IN .h
using namespace Eigen;

int numberArgs;
int totalIntersections = 0;
std::vector<std::string> arguments;


////////////////////////////////////////////////////////////////////////////////
// Define types & classes
////////////////////////////////////////////////////////////////////////////////

struct Ray {
	Vector3d origin;
	Vector3d direction;
	Ray() { }
	Ray(Vector3d o, Vector3d d) : origin(o), direction(d) { }
};

struct Light {
	Vector3d position;
	Vector3d intensity;
};

struct Intersection {
	Vector3d position;
	Vector3d normal;
	double ray_param;
    double tVal;
};

struct Camera {
	bool is_perspective;
	Vector3d position;
	double field_of_view; // between 0 and PI
	double focal_length;
	double lens_radius; // for depth of field
};

struct Material {
	Vector3d ambient_color;
	Vector3d diffuse_color;
	Vector3d specular_color;
	double specular_exponent; // Also called "shininess"

	Vector3d reflection_color;
	Vector3d refraction_color;
	double refraction_index;
};

struct Object {
	Material material;
    std::string type;
	virtual ~Object() = default; // Classes with virtual methods should have a virtual destructor!
	virtual bool intersect(const Ray &ray, Intersection &hit) = 0;
};

// We use smart pointers to hold objects as this is a virtual class
typedef std::shared_ptr<Object> ObjectPtr;

struct Sphere : public Object {
	Vector3d position;
	double radius;
	virtual ~Sphere() = default;
	virtual bool intersect(const Ray &ray, Intersection &hit) override;
};

struct Parallelogram : public Object {
	Vector3d origin;
	Vector3d u;
	Vector3d v;
    std::string type = "pGram";
	virtual ~Parallelogram() = default;
	virtual bool intersect(const Ray &ray, Intersection &hit) override;
};

struct Scene {
	Vector3d background_color;
	Vector3d ambient_light;

	Camera camera;
    std::vector<Sphere*> spheres;
	std::vector<Material> materials;
	std::vector<Light> lights;
	std::vector<ObjectPtr> objects;
};

////////////////////////////////////////////////////////////////////////////////

bool Sphere::intersect(const Ray &ray, Intersection &hit) {
	// TODO:
	//
	// Compute the intersection between the ray and the sphere
	// If the ray hits the sphere, set the result of the intersection in the
	// struct 'hit'

	return false;
}

bool Parallelogram::intersect(const Ray &ray, Intersection &hit) {
	// TODO
	return false;
}

bool affectedByLight(const Intersection &intersection, const Light &light) {

    return false;
}

////////////////////////////////////////////////////////////////////////////////
// Define ray-tracing functions
////////////////////////////////////////////////////////////////////////////////

// Function declaration here (could be put in a header file)
Vector3d ray_color(const Scene &scene, const Ray &ray, const Object &object, const Intersection &hit, int max_bounce);
Object * find_nearest_object(const Scene &scene, const Ray &ray, Intersection &hit, double &closest_t);
bool is_light_visible(const Scene &scene, const Ray &ray, const Light &light);
Vector3d shoot_ray(const Scene &scene, const Ray &ray, int max_bounce);

Vector3d getProjectionOfCenterOntoRay(const Ray &ray, const Sphere &sphere) {

    Vector3d a = Vector3d(sphere.position[0], sphere.position[1], sphere.position[2]);
    Vector3d b = ray.origin + Vector3d(ray.direction[0], ray.direction[1], ray.direction[2]);


    return ((a.dot(b))/ pow(b.norm(), 2)) * b;
}
// -----------------------------------------------------------------------------

Intersection raySphereIntersection(const Sphere &sphereObj, const Ray &ray) {
    Intersection returnIntersection;
    Vector3d normalizedDirection;
    normalizedDirection = ray.direction.normalized();
    double originHitConstant;
    double distanceMultPlus;
    double distanceMultMinus;
    double rootVal = std::pow(normalizedDirection.dot(ray.origin-sphereObj.position), 2);
    rootVal = rootVal - std::pow((ray.origin - sphereObj.position).norm(), 2) + std::pow(sphereObj.radius, 2);
    if (rootVal < 0) {
        returnIntersection.tVal = -1;
        return returnIntersection;
    }
    else {
        originHitConstant = -1 * (normalizedDirection.dot(ray.origin - sphereObj.position));
        distanceMultMinus = originHitConstant - std::sqrt(rootVal);
        distanceMultPlus = originHitConstant + std::sqrt(rootVal);
        if (distanceMultMinus > 0) {
            returnIntersection.position = ray.origin + normalizedDirection * distanceMultMinus;
            returnIntersection.normal = returnIntersection.position - sphereObj.position;
            returnIntersection.tVal = distanceMultMinus;

        }
        else {
            returnIntersection.position = ray.origin + normalizedDirection * distanceMultPlus;
            returnIntersection.normal = returnIntersection.position - sphereObj.position;
            returnIntersection.tVal = distanceMultPlus;
        }
        if (returnIntersection.tVal < .01) {
            returnIntersection.tVal = -1;
        }
        return returnIntersection;


    }
}
/*
Intersection getSphereIntersection(const Sphere &sphereObj, const Ray &ray) {
    Intersection returnIntersection;
    double distanceFromIntersection;
    Sphere sphere;
    sphere.position = sphereObj.position;
    sphere.radius = sphereObj.radius;
    Vector3d originToSphereCenter = sphere.position - ray.origin;
    //Center of sphere is behind the origin of the vector.
    if (ray.direction.dot(originToSphereCenter) < 0.0) {
        if (originToSphereCenter.norm() > sphere.radius) {
            returnIntersection.tVal = -1;
            return returnIntersection;
        }
        //The origin of the ray is on the surface of the sphere.
        else if(originToSphereCenter.norm() == sphere.radius) {
            returnIntersection.position = ray.origin;
            returnIntersection.tVal = 0.0;
            returnIntersection.normal = originToSphereCenter * -1;
            return returnIntersection;
        }
        //The origin is inside the sphere.
        else {
            Vector3d projectionFromCenter = getProjectionOfCenterOntoRay(ray, sphere);
            double projectionDistance = sqrt(pow(sphere.radius, 2) -  pow((projectionFromCenter - sphere.position).norm(), 2));
            double distanceFromIntersection = projectionDistance - (projectionFromCenter - ray.origin).norm();
            returnIntersection.position = ray.origin + ray.direction * distanceFromIntersection;
            returnIntersection.tVal = distanceFromIntersection;
            returnIntersection.normal = -1*(sphere.position - returnIntersection.position);
            return returnIntersection;
        }
    }
    else {
        Vector3d projectionOntoRay = getProjectionOfCenterOntoRay(ray, sphere);
        //If there is no intersection...
        if ((sphere.position - projectionOntoRay).norm() > sphere.radius) {
            returnIntersection.tVal = -1;
            return returnIntersection;
        }
        //Does intersect sphere.
        else {
            double projectionDistance = sqrt(pow(sphere.radius, 2) -  pow((projectionOntoRay - sphere.position).norm(), 2));
            //Origin is outside of the sphere..
            if (originToSphereCenter.norm() > sphere.radius) {
                distanceFromIntersection = (projectionOntoRay - ray.origin).norm() - projectionDistance;
            }
            //origin is inside sphere...
            else {
                distanceFromIntersection = (projectionOntoRay - ray.origin).norm() + projectionDistance;
            }
            returnIntersection.position = ray.origin + ray.direction * distanceFromIntersection;
            returnIntersection.tVal = distanceFromIntersection;
            returnIntersection.normal = -1*(sphere.position);
            return returnIntersection;
        }
    }
}
*/

Vector3d ray_color(const Scene &scene, const Ray &ray, const Object &obj, const Intersection &hit, int max_bounce) {
	// Material for hit object

	const Material &mat = obj.material;

	// Ambient light contribution
	Vector3d ambient_color = obj.material.ambient_color.array() * scene.ambient_light.array();

	// Punctual lights contribution (direct lighting)
	Vector3d lights_color(0, 0, 0);
	for (const Light &light : scene.lights) {
		Vector3d Li = (light.position - hit.position).normalized();

        Ray rayToLight;
        rayToLight.origin = hit.position;
        rayToLight.direction = light.position - hit.position;
		Vector3d N = hit.normal;
        bool affectedByCurrentLight;
        affectedByCurrentLight = true;
		// TODO: Shoot a shadow ray to determine if the light should affect the intersection point
        for (int i = 0; i < scene.spheres.size(); i++) {
            Intersection potentialIntersect = raySphereIntersection(*scene.spheres[i], rayToLight);
            if (potentialIntersect.tVal != -1) {
                affectedByCurrentLight = false;
                break;
            }
        }

        if (affectedByCurrentLight) {

            Vector3d diffuse = mat.diffuse_color * std::max(Li.dot(N), 0.0);

            // TODO: Specular contribution

            Vector3d h = ((-1*ray.direction) + rayToLight.direction)/((-1*ray.direction) + rayToLight.direction).norm();
            Vector3d specular = mat.specular_color * std::pow(std::max(h.dot(N), 0.0), mat.specular_exponent);

            // Attenuate lights according to the squared distance to the lights
            Vector3d D = light.position - hit.position;
            lights_color += (diffuse + specular).cwiseProduct(light.intensity) /  D.squaredNorm();
        }
		// Diffuse contribution

	}

	// TODO: Compute the color of the reflected ray and add its contribution to the current point color.


    Vector3d reflection_color(0,0,0);

    if (max_bounce > 0) {
        Vector3d r = ray.direction - (2 * ray.direction.dot(hit.normal) * hit.normal);
        Ray newRay;
        newRay.direction = r;
        newRay.origin = hit.position + hit.normal * .001;
        reflection_color = .4 * shoot_ray(scene, newRay, max_bounce - 1);
    }




	// TODO: Compute the color of the refracted ray and add its contribution to the current point color.
	//       Make sure to check for total internal reflection before shooting a new ray.
	Vector3d refraction_color(0, 0, 0);

	if (max_bounce > 0) {
		double r = mat.refraction_index;
		Vector3d rayNorm = ray.direction.normalized();
		double c = (-1*hit.normal.normalized()).dot(rayNorm);
		Ray refractedRay;
		refractedRay.origin = hit.position - hit.normal * .001;
		refractedRay.direction = r*rayNorm + ((r*c - std::sqrt(1-(std::pow(r, 2) * (1 - std::pow(c,2))))) * hit.normal.normalized());
		refraction_color = .2 * shoot_ray(scene, refractedRay, max_bounce - 1);
	}
	// Rendering equation
	Vector3d C = ambient_color + lights_color + reflection_color + refraction_color;

	return C;
}



// -----------------------------------------------------------------------------




Object * find_nearest_object(const Scene &scene, const Ray &ray, Intersection &closest_hit) {

    // Find the object in the scene that intersects the ray first
    // The function must return 'nullptr' if no object is hit, otherwise it must
    // return a pointer to the hit object, and set both arguments 'hit' and
    // 'closest_t' to their expected values

    int closest_index = -1;
    double minTVal = 0;
    Intersection closestIntersection;
    for (int i = 0; i < scene.spheres.size(); i++) {
        Intersection thisIntersection = raySphereIntersection(*scene.spheres[i], ray);

        if (thisIntersection.tVal > 0) {

            if (minTVal == 0 || thisIntersection.tVal < minTVal) {
                minTVal = thisIntersection.tVal;
                closest_index = i;
                closestIntersection = thisIntersection;
            }
        }

    }


	if (closest_index < 0) {
		// Return a NULL pointer
		return nullptr;
	} else {
        totalIntersections++;
		// Return a pointer to the hit object. Don't forget to set 'closest_hit' accordingly!
        closest_hit = closestIntersection;
		return scene.objects[closest_index].get();
	}
}

bool is_light_visible(const Scene &scene, const Ray &ray, const Light &light) {
    return true;
}

Vector3d shoot_ray(const Scene &scene, const Ray &ray, int max_bounce) {
	Intersection hit;
	if (Object * obj = find_nearest_object(scene, ray, hit)) {
		// 'obj' is not null and points to the object of the scene hit by the ray
		return ray_color(scene, ray, *obj, hit, max_bounce);
	} else {
		// 'obj' is null, we must return the background color
		return scene.background_color;
	}
}

////////////////////////////////////////////////////////////////////////////////

void render_scene(const Scene &scene) {
	std::cout << "Simple ray tracer." << std::endl;


	int w = 640;
	int h = 480;
	MatrixXd R = MatrixXd::Zero(w, h);
	MatrixXd G = MatrixXd::Zero(w, h);
	MatrixXd B = MatrixXd::Zero(w, h);
	MatrixXd A = MatrixXd::Zero(w, h); // Store the alpha mask

	// The camera always points in the direction -z
	// The sensor grid is at a distance 'focal_length' from the camera center,
	// and covers an viewing angle given by 'field_of_view'.
	double aspect_ratio = double(w) / double(h);

	double hVal = (tan(scene.camera.field_of_view / 2) * scene.camera.focal_length);
	std::cout << "Hval: " << hVal << std::endl;
	double scale_y = hVal; // TODO: Stretch the pixel grid by the proper amount here
	double scale_x = hVal * aspect_ratio; //
	Vector3d lensePosition = scene.camera.position;

	// The pixel grid through which we shoot rays is at a distance 'focal_length'
	// from the sensor, and is scaled from the canonical [-1,1] in order
	// to produce the target field of view.
	Vector3d grid_origin(-scale_x, scale_y, 0);
	Vector3d x_displacement(2.0 / w * scale_x, 0, 0);
	Vector3d y_displacement(0, -2.0 / h * scale_y, 0);
	double focal_length = scene.camera.focal_length;
	int samples = 3;


	for (unsigned i = 0; i < w; ++i) {
		for (unsigned j = 0; j < h; ++j) {
			// TODO: Implement depth of field



				Vector3d shift = grid_origin + (i + 0.5) * x_displacement + (j + 0.5) * y_displacement;

				// Prepare the ray
				Ray ray;

				if (scene.camera.is_perspective) {
					ray.origin = lensePosition;
					ray.direction = shift - lensePosition;

					// TODO
				} else {
					// Orthographic camera
					ray.origin = scene.camera.position + Vector3d(shift[0], shift[1], 0);
					ray.direction = Vector3d(0, 0, -1);
				}



				int max_bounce = 5;
				Vector3d C = shoot_ray(scene, ray, max_bounce);
				if (scene.camera.is_perspective) {
					//Extra samples for depth of field
					for (int i = 1; i < samples; i++) {
						int randMaxBounce = 5;
						double randX = ((double)(rand() % 8))/100;
						double randY = ((double)(rand() % 8))/100;
						Ray randomRay;
						randomRay.origin = lensePosition + Vector3d(randX, randY, 0);
						randomRay.direction = shift - randomRay.origin;
						C = C + shoot_ray(scene, randomRay, randMaxBounce);
					}
				}
				C = C/samples;
				R(i, j) = C(0);
				G(i, j) = C(1);
				B(i, j) = C(2);
				A(i, j) = 1;
	//            R(i, j) = 10;
	//			G(i, j) = 0;
	//			B(i, j) = 0;
	//			A(i, j) = 1;

		}
	}

	// Save to png
    if (numberArgs < 3) {
        const std::string filename("../img/raytrace.png");
        write_matrix_to_png(R, G, B, A, filename);

    }
    else {
        const std::string filename("../img/" + arguments[2]);
        write_matrix_to_png(R, G, B, A, filename);
    }


}

////////////////////////////////////////////////////////////////////////////////

Scene load_scene(const std::string &filename) {
	Scene scene;

	// Load json data from scene file
	json data;

	std::ifstream in(filename);
	in >> data;

	// Helper function to read a Vector3d from a json array
	auto read_vec3 = [] (const json &x) {
		return Vector3d(x[0], x[1], x[2]);
	};

	// Read scene info
	scene.background_color = read_vec3(data["Scene"]["Background"]);
	scene.ambient_light = read_vec3(data["Scene"]["Ambient"]);

	// Read camera info
	scene.camera.is_perspective = data["Camera"]["IsPerspective"];
	scene.camera.position = read_vec3(data["Camera"]["Position"]);
	scene.camera.field_of_view = data["Camera"]["FieldOfView"];
	scene.camera.focal_length = data["Camera"]["FocalLength"];
	scene.camera.lens_radius = data["Camera"]["LensRadius"];

	// Read materials
	for (const auto &entry : data["Materials"]) {
		Material mat;
		mat.ambient_color = read_vec3(entry["Ambient"]);
		mat.diffuse_color = read_vec3(entry["Diffuse"]);
		mat.specular_color = read_vec3(entry["Specular"]);
		mat.reflection_color = read_vec3(entry["Mirror"]);
		mat.refraction_color = read_vec3(entry["Refraction"]);
		mat.refraction_index = entry["RefractionIndex"];
		mat.specular_exponent = entry["Shininess"];
		scene.materials.push_back(mat);
	}

	// Read lights
	for (const auto &entry : data["Lights"]) {
		Light light;
		light.position = read_vec3(entry["Position"]);
		light.intensity = read_vec3(entry["Color"]);
		scene.lights.push_back(light);
	}

	// Read objects
	for (const auto &entry : data["Objects"]) {
		ObjectPtr object;
        Sphere* sp = new Sphere();
		if (entry["Type"] == "Sphere") {

			auto sphere = std::make_shared<Sphere>();
			sphere->position = read_vec3(entry["Position"]);
			sphere->radius = entry["Radius"];
            sphere->type = "sphere";
			object = sphere;

            sp->position = read_vec3(entry["Position"]);
            sp->radius = entry["Radius"];

		} else if (entry["Type"] == "Parallelogram") {
			// TODO
		}
		object->material = scene.materials[entry["Material"]];
		scene.objects.push_back(object);
        scene.spheres.push_back(sp);
	}


	return scene;
}

////////////////////////////////////////////////////////////////////////////////

int main(int argc, char *argv[]) {
    numberArgs = argc;
    for (int i = 0; i < argc; i++) {
        arguments.push_back(argv[i]);
    }

	if (argc < 2) {
		std::cerr << "Usage: " << argv[0] << " scene.json" << std::endl;
		return 1;
	}

	Scene scene = load_scene(argv[1]);
	render_scene(scene);
    std::cout<<totalIntersections<<std::endl;
    for (int i = 0 ; i < scene.spheres.size(); i++) {
        delete(scene.spheres[i]);
    }
	return 0;
}`;
