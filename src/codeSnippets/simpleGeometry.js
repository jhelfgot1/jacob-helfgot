export const simpleGeometryHullSnippet = `////////////////////////////////////////////////////////////////////////////////
#include <algorithm>
#include <numeric>
#include <complex>
#include <fstream>
#include <iostream>
#include <numeric>
#include <vector>

////////////////////////////////////////////////////////////////////////////////

typedef std::complex<double> Point;

typedef std::vector<Point> Polygon;

double pi = 3.1415926535897;
std::vector <Point> holder;
double inline det(const Point &u, const Point &v) {

	return 0;
}

bool isSamePoint(Point a, Point b) {
    if (a.real() == b.real() && a.imag() == b.imag()) {
        return true;
    }
    return false;
}

float dotProd(Point &a, const Point &b) {
    return (a.imag() * b.imag()) + (a.real() * b.real());
}

float ccw(Point &p1, Point &p2, Point &p3) {
    return ((p2.real() - p1.real()) * (p3.imag() - p1.imag())) - ((p2.imag() - p1.imag()) * (p3.real() - p1.real()));
}

struct Compare {
	Point p0; // Leftmost point of the poly
	bool operator ()(const Point &p1, const Point &p2) {
//
//
//        if (p1.real() - p0.real() == 0) {
//            angle1 =
//        }
//        else if (p2.real - p0.real() == 0) {
//            return false;
//        }

        float angle1 = atan((p1.imag() - p0.imag())/(p1.real()-p0.real()));
        float angle2 = atan((p2.imag() - p0.imag())/(p2.real()-p0.real()));
        if (angle1 < 0) {
            angle1 = (pi/2) + ((pi/2) + angle1);
        }
        if (angle2 < 0) {
            angle2 = (pi/2) + ((pi/2) + angle2);
        }
//        float dot1 = dotProd(p0, p1);
//        float dot2 = dotProd(p0, p2);
        return (angle1 < angle2);

	}
};

bool inline salientAngle(Point &a, Point &b, Point &c) {


	return false;
}


Point findLeftBottomPoint(std::vector<Point> v) {
	std::vector <Point> solutions;
    std::vector <int> mindexes;
	if (v.size() > 0) {
		solutions.push_back(v[0]);
        mindexes.push_back(0);
        for (int i = 1; i < v.size(); i++) {
            if(v[i].imag() < solutions[0].imag()) {

                solutions.clear();
                mindexes.clear();
                solutions.push_back(v[i]);
                mindexes.push_back(i);

            }
            else if (v[i].imag() == solutions[0].imag()) {
                solutions.push_back(v[i]);
                mindexes.push_back(i);
            }


        }
    }

    if (solutions.size() > 1) {

        Point absoluteMinimum = solutions[0];
        int minDexFinal = 0;

        for (int j = 1; j < solutions.size(); j++) {
            if (solutions[j].real() < absoluteMinimum.real()) {
                absoluteMinimum = solutions[j];
                minDexFinal = j;
            }
        }
        v.erase(v.begin() + minDexFinal);
        return absoluteMinimum;


    }
    else {
        v.erase(v.begin() + mindexes[0]);

        holder = v;
        return solutions[0];
    }

}

////////////////////////////////////////////////////////////////////////////////

Polygon convex_hull(std::vector<Point> &points) {
    if (points.size() < 3) {
        exit(1);
    }
	Compare order;
    Polygon hull;
	order.p0 = findLeftBottomPoint(points);
    points = holder;
	std::sort(points.begin(), points.end(), order);

    hull.push_back(order.p0);
    hull.push_back(points[0]);
    int m = 2;

    for (int i = 0; i < points.size(); i++) {

        while (ccw(hull[m-2], hull[m-1], points[i]) < 0) {

            m--;
            hull.erase(hull.begin() + m);

        }


        hull.push_back(points[i]);
        m++;



    }

    // salientAngle(a, b, c) here
	return hull;
}

////////////////////////////////////////////////////////////////////////////////

std::vector<Point> load_xyz(const std::string &filename) {
	std::vector<Point> points;
	std::ifstream in(filename);
	std::string newLine;
	int numLines;
	if (!in) {
		std::cerr<<"Unable to open file"<<std::endl;
		exit(1);
	}

	in >> numLines;
	float xVal, yVal, zVal;
	for (int i = 0; i < numLines; i++) {
		in >> xVal;
		in >> yVal;
		in >> zVal;
		points.push_back(Point(xVal, yVal));
	}

	return points;
}

Polygon load_obj(const std::string &filename) {
    Polygon newPoly;
    std::ifstream in(filename);
    std::string newLine;
    int numLines;
    if (!in) {
        std::cerr<<"Error opening polygon file" <<std::endl;
        exit(1);
    }
    in >> numLines;
    float xVal, yVal, zVal;
    for (int i = 0; i < numLines; i++) {
        in >> xVal;
        in >> yVal;
        in >> zVal;
        newPoly.push_back(Point(xVal, yVal));
    }
    return newPoly;
}

void save_obj(const std::string &filename, Polygon &poly) {
	std::ofstream out(filename);
	if (!out.is_open()) {
		throw std::runtime_error("failed to open file " + filename);
	}
	out << std::fixed;
	for (const auto &v : poly) {
		out << "v " << v.real() << ' ' << v.imag() << " 0\n";
	}
	for (size_t i = 0; i < poly.size(); ++i) {
		out << "l " << i+1 << ' ' << 1+(i+1)%poly.size() << "\n";
	}
	out << std::endl;
}


////////////////////////////////////////////////////////////////////////////////

int main(int argc, char * argv[]) {
	if (argc <= 2) {
		std::cerr << "Usage: " << argv[0] << " points.xyz output.obj" << std::endl;
	}
	std::vector<Point> points = load_xyz(argv[1]);


    Point leftMost = findLeftBottomPoint(points);

    Polygon hull = convex_hull(points);

    std::ofstream convexHullFile("../data/output.obj");


    for (int i = 0; i < hull.size(); i++) {
        convexHullFile << "v " << hull[i].real() << " " << hull[i].imag() << " 0\n";
    }
    convexHullFile << "f ";
    for (int i = 1; i <= hull.size(); i++) {
        convexHullFile << i << " ";
    }
    std::ofstream objFile("../data/object.xy");
    for (int i = 0; i < points.size(); i++) {
        objFile << points[i].real() << " " << points[i].imag() << std::endl;
    }

    std::ofstream hullFile("../data/hull.xy");
    for (int i = 0; i <= hull.size(); i++) {
        hullFile << hull[i].real() << " " << hull[i].imag() << std::endl;
    }







	//save_obj(argv[2], hull);

	return 0;
}`;

export const simpleGeometryInsideSnippet = `////////////////////////////////////////////////////////////////////////////////
#include <algorithm>
#include <complex>
#include <fstream>
#include <iostream>
#include <numeric>
#include <math.h>
#include <vector>
////////////////////////////////////////////////////////////////////////////////

typedef std::complex<double> Point;
typedef std::vector<Point> Polygon;
std::vector <int> edges;
std::vector <Point> holder;
std::vector <Point> bounding_box;

double pi = 3.1415926535897;
struct Compare {
	Point p0; // Leftmost point of the poly
	bool operator ()(const Point &p1, const Point &p2) {
//
//
//        if (p1.real() - p0.real() == 0) {
//            angle1 =
//        }
//        else if (p2.real - p0.real() == 0) {
//            return false;
//        }

		float angle1 = atan((p1.imag() - p0.imag())/(p1.real()-p0.real()));
		float angle2 = atan((p2.imag() - p0.imag())/(p2.real()-p0.real()));
		if (angle1 < 0) {
			angle1 = (pi/2) + ((pi/2) + angle1);
		}
		if (angle2 < 0) {
			angle2 = (pi/2) + ((pi/2) + angle2);
		}
//        float dot1 = dotProd(p0, p1);
//        float dot2 = dotProd(p0, p2);
		return (angle1 < angle2);

	}
};

float ccw(Point &p1, Point &p2, Point &p3) {
	return ((p2.real() - p1.real()) * (p3.imag() - p1.imag())) - ((p2.imag() - p1.imag()) * (p3.real() - p1.real()));
}


Point findLeftBottomPoint(std::vector<Point> v) {
	std::vector <Point> solutions;
	std::vector <int> mindexes;
	if (v.size() > 0) {
		solutions.push_back(v[0]);
		mindexes.push_back(0);
		for (int i = 1; i < v.size(); i++) {
			if(v[i].imag() < solutions[0].imag()) {

				solutions.clear();
				mindexes.clear();
				solutions.push_back(v[i]);
				mindexes.push_back(i);

			}
			else if (v[i].imag() == solutions[0].imag()) {
				solutions.push_back(v[i]);
				mindexes.push_back(i);
			}


		}
	}

	if (solutions.size() > 1) {

		Point absoluteMinimum = solutions[0];
		int minDexFinal = 0;

		for (int j = 1; j < solutions.size(); j++) {
			if (solutions[j].real() < absoluteMinimum.real()) {
				absoluteMinimum = solutions[j];
				minDexFinal = j;
			}
		}
		v.erase(v.begin() + minDexFinal);
		return absoluteMinimum;


	}
	else {
		v.erase(v.begin() + mindexes[0]);

		holder = v;
		return solutions[0];
	}

}


double inline det(const Point &u, const Point &v) {
	// TODO
	return 0;
}

// Return true iff [a,b] intersects [c,d], and store the intersection in ans

// used video https://www.youtube.com/watch?v=R08OY6yDNy0 as reference for this algorithm.
bool intersect_segment(const Point &a, const Point &b, const Point &c, const Point &d, Point &ans) {
	// TODO
	return true;
}

Polygon convex_hull(std::vector<Point> &points) {
	if (points.size() < 3) {
		exit(1);
	}
	Compare order;
	Polygon hull;
	order.p0 = findLeftBottomPoint(points);
	points = holder;
	std::sort(points.begin(), points.end(), order);

	hull.push_back(order.p0);
	hull.push_back(points[0]);
	int m = 2;

	for (int i = 0; i < points.size(); i++) {

		if (points[i].real() > 310 && points[i].real() < 312) {
		}

		while (ccw(hull[m-2], hull[m-1], points[i]) < 0) {

			m--;
			hull.erase(hull.begin() + m);

		}


		hull.push_back(points[i]);
		m++;



	}

	// salientAngle(a, b, c) here
	return hull;
}
////////////////////////////////////////////////////////////////////////////////

bool is_inside(Polygon &poly, const Point &query) {

	// 1. Compute bounding box and set coordinate of a point outside the polygon

	// TODO

	// 2. Cast a ray from the query point to the 'outside' point, count number of intersections
	// TODO
	return true;
}

float getOrientation(const Point &segPoint1, const Point &segPoint2, const Point &comparePoint) {
	return ((segPoint2.imag() - segPoint1.imag()) * (comparePoint.real() - segPoint2.real()))
			- ((segPoint2.real() - segPoint1.real()) * (comparePoint.imag() - segPoint2.imag()));
}

bool onSegment(const Point &segPoint1, const Point &segPoint2, const Point &comparePoint) {
	bool pred1 = (std::min(segPoint1.real(), segPoint2.real()) <= comparePoint.real()
				  && std::max(segPoint1.real(), segPoint2.real()) >= comparePoint.real());
	bool pred2 = (std::min(segPoint1.imag(), segPoint2.imag()) <= comparePoint.imag()
				  && std::max(segPoint1.imag(), segPoint2.imag()) >= comparePoint.imag());
	if (pred1 && pred2) {
		return true;
	}

	else {
		return false;
	}


}
bool doIntersect(const Point &a, const Point &b, const Point &c, const Point &d) {

	float dir1 = (getOrientation(c, d, a));
	float dir2 = (getOrientation(c, d, b));
	float dir3 = (getOrientation(a, b, c));
	float dir4 = (getOrientation(a, b, d));



	if 	(((dir1 > 0 && dir2 < 0) || (dir1 < 0 && dir2 > 0)) && ((dir3 > 0 && dir4 < 0) || (dir3 < 0 && dir4 > 0))) {
		return true;
	}

	else if (dir1 == 0 && onSegment(c, d, a)) {
		return true;
	}

	else if (dir2 == 0 && onSegment(c, d, b)) {
		return true;
	}

	else if (dir3 == 0 && onSegment(a, b, c)) {
		return true;
	}

	else if (dir4 == 0 && onSegment(a, b, d)) {
		return true;
	}

	else {
		return false;
	}

}

////////////////////////////////////////////////////////////////////////////////

std::vector<Point> load_xyz(const std::string &filename) {
	std::vector<Point> points;
	std::ifstream in("../data/" + filename);
	if (!in) {
		std::cerr<<"Error opening polygon file" <<std::endl;
		exit(-1);
	}
	else {
		int numPoints;
		in >> numPoints;

		for (int i = 0; i < numPoints; i++) {
			float x, y, z;
			std::string letter;
			in >> x;
			in >> y;
			in >> z;

			points.push_back(Point(x, y));
		}
		return points;
	}

}



Polygon load_obj(const std::string &filename) {

	std::ifstream in("../data/" + filename);

    if (!in) {
        std::cerr<<"Error opening polygon file" <<std::endl;
        exit(-1);
	}
    else {
		Polygon newPoly;
		std::string lineIndicator;
		in >> lineIndicator;
		float xCoord;
		float yCoord;
		float zCoord;
		while (lineIndicator != "f" && !in.eof()) {
			in >> xCoord;
			in >> yCoord;
			in >> zCoord;
			newPoly.push_back(Point(xCoord, yCoord));
			in >> lineIndicator;
		}
		int newEdge;
		while(!in.eof()) {
			in >> newEdge;
			edges.push_back(newEdge);
		}
		return newPoly;
	}


}

void save_xyz(const std::string &filename, const std::vector<Point> &points) {
	std::ofstream out("../data/" + filename);

	if (!out) {
		std::cerr<<"Error opening polygon file" <<std::endl;
		exit(-1);
	}
	else {
		out << points.size() << std::endl;
		for (int i = 0; i < points.size(); i++) {

			out << points[i].real() << " " << points[i].imag() << " 0.0" << std::endl;

		}

		out.close();
	}
}


Point pointsInPolygon(std::vector <Point> &pointsInsidePoly, std::vector <Point> &pointsOutsidePoly,
					 const Point &distantPoint, const std::vector <Point> pointsToCheck, const Polygon hull) {

	int totalInside = 0;
	int totalOutside = 0;
	for (int i = 0; i < pointsToCheck.size(); i++) {
		int intersections = 0;
		for (int j = 1; j < hull.size(); j++) {

			if (doIntersect(hull[j - 1], hull[j], pointsToCheck[i], distantPoint)) {
				intersections++;
			}

		}
		Point newPoint = Point(pointsToCheck[i].real(), pointsToCheck[i].imag());

		if (intersections % 2 == 1) {
			totalInside++;
			pointsInsidePoly.push_back(newPoint);
		}
		else {
			totalOutside++;
			pointsOutsidePoly.push_back(newPoint);
		}

	}

	return Point(totalInside, totalOutside);

}



////////////////////////////////////////////////////////////////////////////////

int main(int argc, char * argv[]) {
	if (argc <= 3) {
		std::cerr << "Usage: " << argv[0] << " points.xyz poly.obj result.xyz" << std::endl;
	}
	std::vector<Point> points = load_xyz(argv[1]);
	Polygon poly = load_obj(argv[2]);
	std::ofstream objectFile("../data/object.xy");
	for (int i = 0; i < poly.size(); i++) {

		objectFile << poly[i].real() << " " << poly[i].imag()<< std::endl;
	}

	objectFile.close();
	std::ofstream convexHullFile("../data/hull.xy");

	bounding_box = convex_hull(poly);

	float maxX = 0.0;
	float maxY = 0.0;
	for (int i = 0; i < bounding_box.size(); i++) {

		convexHullFile << bounding_box[i].real() << " " << bounding_box[i].imag()<< std::endl;
		if (bounding_box[i].real() > maxX) {
			maxX = bounding_box[i].real();
		}
		if (bounding_box[i].imag() > maxY) {
			maxY = bounding_box[i].imag();
		}

	}


	poly = load_obj(argv[2]);
	Point distantPoint = Point (maxX, maxY);


	convexHullFile.close();

	std::vector <Point> pointsInside;
	std::vector <Point> pointsOutside;


	std::vector <Point> polyCopy;

	for (int i = 0; i < poly.size(); i++) {
		polyCopy.push_back(Point(poly[i].real(), poly[i].imag()));
	}
	polyCopy.push_back(poly[0]);
	Point totals = pointsInPolygon(pointsInside, pointsOutside, distantPoint, points, polyCopy);



	save_xyz( "insidePoints.xyz", pointsInside);
	save_xyz( "outsidePoints.xyz", pointsOutside);
	return 0;
}`;
