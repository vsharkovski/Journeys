package com.sorsix.journeys.service

import org.springframework.web.multipart.MultipartFile
import java.io.*

class BASE64DecodedMultipartFile(private val imgContent: ByteArray) : MultipartFile {
    override fun getName(): String {
        // TODO - implementation depends on your requirements
        return ""
    }

    override fun getOriginalFilename(): String? {
        // TODO - implementation depends on your requirements
        return null
    }

    override fun getContentType(): String? {
        // TODO - implementation depends on your requirements
        return null
    }

    override fun isEmpty(): Boolean {
        return imgContent == null || imgContent.size == 0
    }

    override fun getSize(): Long {
        return imgContent.size.toLong()
    }

    @Throws(IOException::class)
    override fun getBytes(): ByteArray {
        return imgContent
    }

    @Throws(IOException::class)
    override fun getInputStream(): InputStream {
        return ByteArrayInputStream(imgContent)
    }

    @Throws(IOException::class, IllegalStateException::class)
    override fun transferTo(dest: File) {
        FileOutputStream(dest).write(imgContent)
    }
}