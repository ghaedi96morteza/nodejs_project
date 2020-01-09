clc
clear all
close all
%%%%%%%%%%%%%%%%%%
pic = imread('color.jpg');
figure('NumberTitle','on','Name','Converting Functions and Rotation');
subplot (3,3,1); imshow(pic); title ('Original');
imwrite(pic,'Original.jpg');

%convert to black/white
bw = im2bw(pic);
subplot (3,3,2); imshow(bw); title ('black/white');
imwrite(bw,'blackwhite.jpg');

%convert to gray method 1
gray_1=rgb2gray(pic);
subplot (3,3,3); imshow(gray_1); title ('gray method 1');
imwrite(pic,'gray_1.jpg');

%convert to gray method 2
a = pic;
b= double(a);
c = (b(:,:,1)+b(:,:,2)+b(:,:,3))/3;
c = uint8(c);
subplot (3,3,4); imshow(c); title ('gray method 2');
imwrite(c,'gray_2.jpg');

%resize
resize_05 = imresize(pic,0.5);
subplot (3,3,5); imshow(resize_05); title ('resize 0.5');
imwrite(resize_05,'resize 0.5.jpg');
resize_3 = imresize(pic,3);
subplot (3,3,6); imshow(resize_3); title ('resize 3');
imwrite(resize_3,'resize 3.jpg');

%rotate
r1 = imrotate(pic,30);
subplot (3,3,7); imshow(r1); title ('rotate 30');
imwrite(r1,'rotate 30.jpg');
r2 = imrotate(pic,60);
subplot (3,3,8); imshow(r2); title ('rotate 60');
imwrite(r2,'rotate 60.jpg');
r3 = imrotate(pic,180);
subplot (3,3,9); imshow(r3); title ('rotate 180');
imwrite(pic,'rotate 180.jpg');




